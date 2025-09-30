import { JSDOM } from 'jsdom';
import { Canvas, createCanvas, Image, ImageData, loadImage } from 'canvas';
import Tesseract from 'tesseract.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';

export class OcrService {
    private cv: any;

    constructor(cv: any) {
        this.installDOM();
        this.cv = cv;
    }

    private installDOM() {
        const dom = new JSDOM();
        global.document = dom.window.document;
        // @ts-ignore
        global.Image = Image;
        // @ts-ignore
        global.HTMLCanvasElement = Canvas;
        // @ts-ignore
        global.ImageData = ImageData;
        // @ts-ignore
        global.HTMLImageElement = Image;
    }

    public async recognizeTTN(filepath: string) {
        const image = await loadImage(filepath);
        const titleImage = await loadImage('public/ttn/templates/title.png');
        const cargoImage = await loadImage('public/ttn/templates/cargo.png');
        const weightImage = await loadImage('public/ttn/templates/weight.png');

        const src = this.cv.imread(image);
        const titleTemplate = this.cv.imread(titleImage);
        const cargoTemplate = this.cv.imread(cargoImage);
        const weightTemplate = this.cv.imread(weightImage);

        // Меняем количество каналов до ЧБ
        let gray = new this.cv.Mat();
        let titleTemplateGray = new this.cv.Mat();
        let cargoTemplateGray = new this.cv.Mat();
        let weightTemplateGray = new this.cv.Mat();
        this.cv.cvtColor(src, gray, this.cv.COLOR_RGBA2GRAY);
        this.cv.cvtColor(
            titleTemplate,
            titleTemplateGray,
            this.cv.COLOR_RGBA2GRAY
        );
        this.cv.cvtColor(
            cargoTemplate,
            cargoTemplateGray,
            this.cv.COLOR_RGBA2GRAY
        );
        this.cv.cvtColor(
            weightTemplate,
            weightTemplateGray,
            this.cv.COLOR_RGBA2GRAY
        );
        // Увеличиваем разрешение изображения
        let resized = new this.cv.Mat();
        let dsize = new this.cv.Size(1450, 1950);
        this.cv.resize(gray, resized, dsize, 0, 0, this.cv.INTER_CUBIC);

        // Фильтр повышения резкости
        let kernel = this.cv.matFromArray(
            3,
            3,
            this.cv.CV_32F,
            [0, -0.55, 0, -0.55, 3, -0.55, 0, -0.55, 0]
        );
        let sharpened = new this.cv.Mat();
        this.cv.filter2D(resized, sharpened, src.depth(), kernel);

        // Увеличение контраста
        let contrast = new this.cv.Mat();
        this.cv.convertScaleAbs(sharpened, contrast, 1.5, 0);

        // Выполняем template matching для title

        const resultTitleTemplate = new this.cv.Mat();
        const resultCargoTemplate = new this.cv.Mat();
        const resultWeightTemplate = new this.cv.Mat();
        this.cv.matchTemplate(
            contrast,
            titleTemplateGray,
            resultTitleTemplate,
            this.cv.TM_CCOEFF_NORMED
        );
        this.cv.matchTemplate(
            contrast,
            cargoTemplateGray,
            resultCargoTemplate,
            this.cv.TM_CCOEFF_NORMED
        );
        this.cv.matchTemplate(
            contrast,
            weightTemplateGray,
            resultWeightTemplate,
            this.cv.TM_CCOEFF_NORMED
        );

        const title = this.getMatchHighestTreshold(
            resultTitleTemplate,
            titleTemplateGray
        );
        const cargo = this.getMatchHighestTreshold(
            resultCargoTemplate,
            cargoTemplateGray
        );
        const weight = this.getMatchHighestTreshold(
            resultWeightTemplate,
            weightTemplateGray
        );
        const match = filepath.match(/(\d+)-(\d+)/);

        const textBlocks = [];

        if (title) {
            const rect = new this.cv.Rect(
                title.x,
                title.y,
                title.width,
                title.height
            );
            let paddedRect = this.addPaddingToRect(
                rect,
                10,
                1100,
                contrast.cols,
                contrast.rows
            );
            let textBlock = contrast.roi(paddedRect);
            textBlocks.push({
                textBlock,
                name: match ? `${match[0]}-title` : `title`,
                type: 'title',
            });
            this.saveBlockAsImage(
                textBlock,
                match ? `${match[0]}-title` : `title`
            );
        }

        if (weight) {
            const rect = new this.cv.Rect(
                weight.x,
                weight.y,
                weight.width,
                weight.height
            );

            let paddedRect = this.addPaddingToRect(
                rect,
                10,
                1100,
                contrast.cols,
                contrast.rows
            );
            let textBlock = contrast.roi(paddedRect);
            textBlocks.push({
                textBlock,
                name: match ? `${match[0]}-weight` : `weight`,
                type: 'weight',
            });
            this.saveBlockAsImage(
                textBlock,
                match ? `${match[0]}-weight` : `weight`
            );
        }

        if (cargo) {
            const rect = new this.cv.Rect(
                cargo.x,
                cargo.y,
                cargo.width,
                cargo.height
            );
            let paddedRect = this.addPaddingWithBottomFollowToRect(
                rect,
                weight.y - weight.height - cargo.y - 100,
                1200,
                contrast.cols,
                contrast.rows
            );
            let textBlock = contrast.roi(paddedRect);
            textBlocks.push({
                textBlock,
                name: match ? `${match[0]}-cargo` : `cargo`,
                type: 'cargo',
            });
            this.saveBlockAsImage(
                textBlock,
                match ? `${match[0]}-cargo` : `cargo`
            );
        }

        const results: Record<string, string> = {};

        for (let block of textBlocks) {
            const {
                data: { text },
            } = await Tesseract.recognize(
                `public/ttn/output_${block.name}.png`,
                'rus'
            );

            results[block.type] = text.trim();
        }

        const formattedResult = {
            title: this.extractTitle(results.title),
            cargo: this.extractGoodsInfo(results.cargo),
            weight: this.extractWeightVolume(results.weight),
        };

        //Удаление источников
        src.delete();
        titleTemplate.delete();
        cargoTemplate.delete();
        weightTemplate.delete();

        //Удаление увеличенных версий
        resized.delete();

        //Удаления ядра применения функций
        kernel.delete();

        //Удаление фильтров
        sharpened.delete();
        contrast.delete();
        gray.delete();
        titleTemplateGray.delete();
        weightTemplateGray.delete();
        cargoTemplateGray.delete();

        //Удаление файлов
        for (let block of textBlocks) {
            const filePath = `public/ttn/output_${block.name}.png`;
            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
        }
        if (existsSync(filepath)) {
            unlinkSync(filepath);
        }

        return formattedResult;
    }

    private getMatchHighestTreshold(resultMatches: any, template: any) {
        const matches = [];
        const threshold = 0.3; // Порог уверенности (0.0 - 1.0)

        for (let y = 0; y < resultMatches.rows; y++) {
            for (let x = 0; x < resultMatches.cols; x++) {
                const confidence = resultMatches.floatAt(y, x);
                if (confidence > threshold) {
                    matches.push({
                        x: x,
                        y: y,
                        confidence: confidence,
                        width: template.cols,
                        height: template.rows,
                    });
                }
            }
        }

        matches.sort((a, b) => b.confidence - a.confidence);

        return matches[0];
    }

    private addPaddingWithBottomFollowToRect(
        rect: any,
        paddingHeight: any,
        paddingWidth: any,
        maxWidth: any,
        maxHeight: any
    ) {
        let x = Math.max(0, rect.x - paddingWidth);
        let y = Math.max(0, rect.y);
        let width = Math.min(maxWidth - x, rect.width + paddingWidth * 2);
        let height = Math.min(maxHeight - y, rect.height + paddingHeight);

        return new this.cv.Rect(x, y, width, height);
    }

    private addPaddingToRect(
        rect: any,
        paddingHeight: any,
        paddingWidth: any,
        maxWidth: any,
        maxHeight: any
    ) {
        let x = Math.max(0, rect.x - paddingWidth);
        let y = Math.max(0, rect.y - paddingHeight);
        let width = Math.min(maxWidth - x, rect.width + paddingWidth * 2);
        let height = Math.min(maxHeight - y, rect.height + paddingHeight * 2);

        return new this.cv.Rect(x, y, width, height);
    }

    private saveBlockAsImage(blockMat: any, filename: any) {
        const canvas = createCanvas(300, 300);
        canvas.width = blockMat.cols;
        canvas.height = blockMat.rows;

        // Отображаем блок на canvas
        // @ts-ignore
        cv.imshow(canvas, blockMat);

        writeFileSync(
            `public/ttn/output_${filename}.png`,
            canvas.toBuffer('image/png')
        );
    }

    private extractTitle(text: string | undefined) {
        const pattern =
            /(Т[РR]А[НИ]СПОРТ[НИ]А[ЯI]?\s+[НИ]АК[ЛП]АД[НИ]А[ЯI]?\s*)([№И]?\s*\d+\s*\/?\s*[А-ЯA-Z0-9])?/i;

        const match = text ? text.match(pattern) : '';
        if (!match) return '';

        let title = match[1].trim();

        title = title
            .replace(/Т[РR]А/g, 'ТРА')
            .replace(/[НИ]АК/g, 'НАК')
            .replace(/[ЛП]АД/g, 'ЛАД')
            .replace(/[НИ]А[ЯI]/g, 'НАЯ')
            .replace(/СПОРТ[НИ]А/g, 'СПОРТНА');

        let number = match[2].trim();

        if (!number.startsWith('№')) {
            if (number.startsWith('2')) {
                number = '№' + number.slice(1);
            } else {
                number = '№' + number;
            }
        }

        if (!number.includes('/')) {
            if (number.endsWith('5')) {
                number = number.slice(0, -1);
                number += '/Б';
            }
        } else if (number.endsWith('6')) {
            number = number.slice(0, -1);
            number += 'Б';
        }

        const result = title.toUpperCase() + ' ' + number;
        return result;
    }

    private extractGoodsInfo(text: string | undefined) {
        const pattern =
            /(.*?)\.[\s\S]*?[НИ]а[ни]ме[ни]ова[ни][ни]е\s*[—\-–][\s\S]*?([\s\S]*?)\s*(\d+)\s*шт\.?/gi;
        const results = [];
        let match;
        let index = 0;

        while ((match = pattern.exec(text ? text : '')) !== null) {
            const [, _number, name, quantity] = match;
            index++;

            const cleanedName = name
                .replace(/\|/g, '')
                .replace(
                    /(Кол-во|Ой|Кой|Мой|Ой-во|Кол[ин]чество)[\s\-—]*мест[\s\-—]*[—\-–]?\s*\d+/gi,
                    ''
                )
                .replace(/(\d+)х\s*(\d+)х\s*(\d+)/g, '$1х$2х$3')
                .replace(/\s+/g, ' ')
                .trim();

            results.push(`${index}. ${cleanedName} ${quantity} шт`);
        }

        return results.join('\n');
    }

    private extractWeightVolume(text: string | undefined) {
        const nettoMatch = text
            ? text.match(/[НИ]е[гт][гт]о\s*[—\-:\s]+\s*([\d,\.]+)\s*т?\.?/i)
            : '';
        const bruttoMatch = text
            ? text.match(/Бру[гт][гт][о0]\s*[—\-:\s]+\s*([\d,\.]+)\s*т?\.?/i)
            : '';
        const volumeMatch = text
            ? text.match(/[О0]бъем\s*[—\-:\s]+\s*([\d,\.]+)\s*м\s*\??/i)
            : '';

        let netto = '';
        let brutto = '';
        let volume = '';
        if (nettoMatch && bruttoMatch && volumeMatch) {
            netto = nettoMatch[1];
        }
        if (bruttoMatch) {
            brutto = bruttoMatch[1];
        }
        if (volumeMatch) {
            volume = volumeMatch[1];
        }
        return `Нетто — ${netto} т., Брутто — ${brutto} т., Объем — ${volume} м³`;
    }
}
