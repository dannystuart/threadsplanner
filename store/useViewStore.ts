'use client';

import { create } from 'zustand';

export type ViewMode = 'default' | 'mini';

interface ViewState {
    viewMode: ViewMode;
    toggleViewMode: () => void;
    setViewMode: (mode: ViewMode) => void;
}

export const useViewStore = create<ViewState>((set) => ({
    viewMode: 'default',
    toggleViewMode: () =>
        set((state) => ({
            viewMode: state.viewMode === 'default' ? 'mini' : 'default',
        })),
    setViewMode: (mode) => set({ viewMode: mode }),
}));
