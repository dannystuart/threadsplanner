import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ContentBlock, NewContentBlock, TimeSlot } from '@/types';

/* ==========================================================================
   Planner Store Types
   ========================================================================== */

interface PlannerState {
    /** All content blocks */
    blocks: ContentBlock[];
}

interface PlannerActions {
    /** Add a new content block */
    addBlock: (block: NewContentBlock) => string;

    /** Update an existing block */
    updateBlock: (id: string, updates: Partial<ContentBlock>) => void;

    /** Delete a block by ID */
    deleteBlock: (id: string) => void;

    /** Toggle the isDone status of a block */
    toggleDone: (id: string) => void;

    /** Move a block to a new date and/or time slot */
    moveBlock: (id: string, newDate: string, newTimeSlot: TimeSlot) => void;

    /** Get blocks for a specific date */
    getBlocksByDate: (date: string) => ContentBlock[];

    /** Get a single block by ID */
    getBlockById: (id: string) => ContentBlock | undefined;

    /** Clear all blocks (for development/testing) */
    clearAllBlocks: () => void;
}

type PlannerStore = PlannerState & PlannerActions;

/* ==========================================================================
   UUID Generator
   ========================================================================== */

function generateId(): string {
    return crypto.randomUUID();
}

/* ==========================================================================
   Zustand Store with Persist Middleware
   ========================================================================== */

export const usePlannerStore = create<PlannerStore>()(
    persist(
        (set, get) => ({
            // Initial state
            blocks: [],

            // Actions
            addBlock: (newBlock: NewContentBlock) => {
                const id = generateId();
                const now = new Date().toISOString();

                const block: ContentBlock = {
                    ...newBlock,
                    id,
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    blocks: [...state.blocks, block],
                }));

                return id;
            },

            updateBlock: (id: string, updates: Partial<ContentBlock>) => {
                set((state) => ({
                    blocks: state.blocks.map((block) =>
                        block.id === id
                            ? { ...block, ...updates, updatedAt: new Date().toISOString() }
                            : block
                    ),
                }));
            },

            deleteBlock: (id: string) => {
                set((state) => ({
                    blocks: state.blocks.filter((block) => block.id !== id),
                }));
            },

            toggleDone: (id: string) => {
                set((state) => ({
                    blocks: state.blocks.map((block) =>
                        block.id === id
                            ? { ...block, isDone: !block.isDone, updatedAt: new Date().toISOString() }
                            : block
                    ),
                }));
            },

            moveBlock: (id: string, newDate: string, newTimeSlot: TimeSlot) => {
                set((state) => ({
                    blocks: state.blocks.map((block) =>
                        block.id === id
                            ? { ...block, date: newDate, timeSlot: newTimeSlot, updatedAt: new Date().toISOString() }
                            : block
                    ),
                }));
            },

            getBlocksByDate: (date: string) => {
                return get().blocks.filter((block) => block.date === date);
            },

            getBlockById: (id: string) => {
                return get().blocks.find((block) => block.id === id);
            },

            clearAllBlocks: () => {
                set({ blocks: [] });
            },
        }),
        {
            name: 'twine-planner-storage', // localStorage key
            storage: createJSONStorage(() => localStorage),
            // Only persist the blocks array, not the action functions
            partialize: (state) => ({ blocks: state.blocks }),
        }
    )
);

/* ==========================================================================
   Selector Hooks for Performance
   ========================================================================== */

/**
 * Select blocks for a specific date (memoization-friendly)
 */
export const useBlocksByDate = (date: string) => {
    return usePlannerStore((state) =>
        state.blocks.filter((block) => block.date === date)
    );
};

/**
 * Select blocks for a specific date and time slot
 */
export const useBlocksByDateAndSlot = (date: string, timeSlot: TimeSlot) => {
    return usePlannerStore((state) =>
        state.blocks.filter((block) => block.date === date && block.timeSlot === timeSlot)
    );
};

/**
 * Get total block count
 */
export const useBlockCount = () => {
    return usePlannerStore((state) => state.blocks.length);
};

/**
 * Get count of completed blocks
 */
export const useDoneBlockCount = () => {
    return usePlannerStore((state) =>
        state.blocks.filter((block) => block.isDone).length
    );
};
