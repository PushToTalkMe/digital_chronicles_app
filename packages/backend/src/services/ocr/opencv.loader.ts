import { dirname, join } from 'path';

export class OpenCVLoader {
    private isLoaded = false;

    async load(): Promise<void> {
        if (this.isLoaded) return;

        return new Promise(async (resolve) => {
            global.Module = {
                onRuntimeInitialized: () => {
                    this.isLoaded = true;
                    resolve();
                },
            };

            try {
                const projectRoot = this.getProjectRoot();
                const opencvPath = join(projectRoot, '../libs/opencv.js');
                const cvModule = require(opencvPath);
                global.cv = cvModule;
            } catch (error) {
                console.error('Failed to load OpenCV:', error);
                throw error;
            }
        });
    }

    private getProjectRoot(): string {
        return dirname(require.main?.filename || process.cwd());
    }

    getCV(): any {
        if (!this.isLoaded) {
            throw new Error('OpenCV not loaded. Call load() first.');
        }
        return global.cv;
    }
}
