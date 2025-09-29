import { OcrService } from './ocr.service';
import { OpenCVLoader } from './opencv.loader';

export class OcrServiceFactory {
    private openCVLoader = new OpenCVLoader();
    private ocr: OcrService | null = null;

    constructor() {}

    public async generate() {
        if (this.ocr) {
            return this.ocr;
        } else {
            try {
                await this.openCVLoader.load();
                const cv = this.openCVLoader.getCV();
                this.ocr = new OcrService(cv);
                return this.ocr;
            } catch (error) {
                throw error;
            }
        }
    }
}
