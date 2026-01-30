import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { create } from 'zustand';

interface FFmpegState {
    instance: FFmpeg | null;
    isLoading: boolean;
    isLoaded: boolean;
    error: string | null;
    loadingProgress: number;
    
    // Actions
    loadFFmpeg: () => Promise<FFmpeg>;
    getFFmpeg: () => Promise<FFmpeg>;
    resetFFmpeg: () => void;
    setLoadingProgress: (progress: number) => void;
}

export const useFFmpegStore = create<FFmpegState>((set, get) => ({
    instance: null,
    isLoading: false,
    isLoaded: false,
    error: null,
    loadingProgress: 0,

    setLoadingProgress: (progress: number) => {
        set({ loadingProgress: progress });
    },

    loadFFmpeg: async () => {
        const state = get();

        if (state.instance && state.isLoaded) {
            return state.instance;
        }

        // Prevent multiple simultaneous loads
        if (state.isLoading) {
            // Wait for current load to complete
            return new Promise<FFmpeg>((resolve, reject) => {
                const checkInterval = setInterval(() => {
                    const currentState = get();
                    if (currentState.isLoaded && currentState.instance) {
                        clearInterval(checkInterval);
                        resolve(currentState.instance);
                    } else if (currentState.error) {
                        clearInterval(checkInterval);
                        reject(new Error(currentState.error));
                    }
                }, 100);
            });
        }

        set({ isLoading: true, error: null, loadingProgress: 0 });

        try {
            // Dynamic import - wasm file is ~10MB, only loaded when needed
            const { FFmpeg } = await import('@ffmpeg/ffmpeg')

            const ffmpeg = new FFmpeg();
            await ffmpeg.load();

            set({ 
                instance: ffmpeg, 
                isLoaded: true, 
                isLoading: false,
                error: null 
            });

            return ffmpeg;
        } catch (error) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to initialize FFmpeg';
            
            set({ 
                error: errorMessage, 
                isLoading: false,
                loadingProgress: 0,
                instance: null,
                isLoaded: false
            });
            
            console.error('Failed to load FFmpeg:', error);
            throw new Error(errorMessage);
        }
    },

    getFFmpeg: async () => {
        const state = get();
        
        if (state.instance && state.isLoaded) {
            return state.instance;
        }
        
        return state.loadFFmpeg();
    },

    resetFFmpeg: () => {
        set({ 
            instance: null, 
            isLoaded: false, 
            isLoading: false, 
            error: null,
            loadingProgress: 0
        });
    },
}));

// for utility functions (tool funtions)
export async function getFFmpegInstance(): Promise<FFmpeg> {
    return useFFmpegStore.getState().loadFFmpeg();
}