import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TEXT_TAGS, CREATIVE_TAGS } from '@/types';

/* ==========================================================================
   Tag Store Types
   ========================================================================== */

interface TagState {
    /** Custom tags for Text content type */
    textTags: string[];
    /** Custom tags for Creative content type */
    creativeTags: string[];
}

interface TagActions {
    /** Add a new tag to a list */
    addTag: (type: 'text' | 'creative', tag: string) => void;
    /** Remove a tag from a list */
    removeTag: (type: 'text' | 'creative', tag: string) => void;
    /** Rename a tag */
    renameTag: (type: 'text' | 'creative', oldTag: string, newTag: string) => void;
    /** Get all tags for a type (defaults + custom) */
    getTagsForType: (type: 'text' | 'creative') => string[];
}

type TagStore = TagState & TagActions;

/* ==========================================================================
   Zustand Store with Persist
   ========================================================================== */

export const useTagStore = create<TagStore>()(
    persist(
        (set, get) => ({
            // Initial state - start with default tags
            textTags: [...TEXT_TAGS],
            creativeTags: [...CREATIVE_TAGS],

            // Actions
            addTag: (type, tag) => {
                const trimmed = tag.trim();
                if (!trimmed) return;

                set((state) => {
                    const key = type === 'text' ? 'textTags' : 'creativeTags';
                    const existing = state[key];
                    if (existing.includes(trimmed)) return state;
                    return { [key]: [...existing, trimmed] };
                });
            },

            removeTag: (type, tag) => {
                set((state) => {
                    const key = type === 'text' ? 'textTags' : 'creativeTags';
                    return { [key]: state[key].filter((t) => t !== tag) };
                });
            },

            renameTag: (type, oldTag, newTag) => {
                const trimmed = newTag.trim();
                if (!trimmed) return;

                set((state) => {
                    const key = type === 'text' ? 'textTags' : 'creativeTags';
                    const existing = state[key];
                    if (existing.includes(trimmed) && trimmed !== oldTag) return state;
                    return {
                        [key]: existing.map((t) => (t === oldTag ? trimmed : t)),
                    };
                });
            },

            getTagsForType: (type) => {
                const state = get();
                return type === 'text' ? state.textTags : state.creativeTags;
            },
        }),
        {
            name: 'twine-tags-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                textTags: state.textTags,
                creativeTags: state.creativeTags,
            }),
        }
    )
);
