import { Image, Canvas, ImageData } from 'canvas';

interface OpenCV {
    Mat: any;
    imread: (element: string | HTMLImageElement) => any;
    imshow: (canvas: string | HTMLCanvasElement, mat: any) => void;
}

declare module '@libs/opencv' {
    const cv: OpenCV;
    export = cv;
}

interface ModuleConfig {
    onRuntimeInitialized?: () => void;
}

declare global {
    var Module: ModuleConfig;
    var cv: OpenCV;
}

export {};
