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
                const cvModule = await import('@libs/opencv'!);
                global.cv = cvModule.default;
            } catch (error) {
                console.error('Failed to load OpenCV:', error);
                throw error;
            }
        });
    }

    getCV(): any {
        if (!this.isLoaded) {
            throw new Error('OpenCV not loaded. Call load() first.');
        }
        return global.cv;
    }
}
