/* ==========================================================================
   Twine Planner - Type Definitions
   ========================================================================== */

/**
 * Content block types - each maps to a specific color in the design system
 * Text (Yellow/Primary), Creative (Green/Secondary), Recycled (Blue), Flexible (Purple)
 */
export const ContentType = {
    TEXT: 'text',
    CREATIVE: 'creative',
    RECYCLED: 'recycled',
    FLEXIBLE: 'flexible',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

/**
 * Time slots for content scheduling (3 slots per day)
 * 0 = Morning, 1 = Afternoon, 2 = Evening
 */
export type TimeSlot = 0 | 1 | 2;

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
    0: 'Morning',
    1: 'Afternoon',
    2: 'Evening',
};

/* ==========================================================================
   Tag Constants - Context-aware tags based on content type
   ========================================================================== */

export const TEXT_TAGS = [
    'Encourage Dreams',
    'Share Insight',
    'Ask Question',
    'Tell Story',
    'Spark Discussion',
    'Share Opinion',
] as const;

export const CREATIVE_TAGS = [
    'Behind the Scenes',
    'Tutorial',
    'Showcase',
    'Inspiration',
    'Process',
    'Before & After',
] as const;

export const RECYCLED_TAGS = [
    'Evergreen',
    'Best Of',
    'Throwback',
    'Updated Classic',
    'Fan Favorite',
] as const;

export const FLEXIBLE_TAGS = [
    'Trending Topic',
    'Current Event',
    'Collaboration',
    'Seasonal',
    'Experiment',
] as const;

/**
 * Map content type to available tags
 */
export const TAGS_BY_TYPE: Record<ContentType, readonly string[]> = {
    [ContentType.TEXT]: TEXT_TAGS,
    [ContentType.CREATIVE]: CREATIVE_TAGS,
    [ContentType.RECYCLED]: RECYCLED_TAGS,
    [ContentType.FLEXIBLE]: FLEXIBLE_TAGS,
};

/* ==========================================================================
   Content Block Interface
   ========================================================================== */

/**
 * A content block represents a single piece of planned Threads content
 */
export interface ContentBlock {
    /** Unique identifier (UUID) */
    id: string;

    /** Type determines color and available tags */
    type: ContentType;

    /** Title for the content block (displayed on cards) */
    title: string;

    /** The actual content/draft text (max 500 chars for Threads) - only shown in edit modal */
    text: string;

    /** Strategic tags for categorization */
    tags: string[];

    /** Promotional content flag - shows megaphone badge */
    isPromotional: boolean;

    /** Whether the content has been posted */
    isDone: boolean;

    /** Scheduled date (ISO 8601 string: YYYY-MM-DD) */
    date: string;

    /** Time slot: 0 (Morning), 1 (Afternoon), 2 (Evening) */
    timeSlot: TimeSlot;

    /** Creation timestamp */
    createdAt: string;

    /** Last update timestamp */
    updatedAt: string;
}

/* ==========================================================================
   Threads Platform Constants
   ========================================================================== */

/** Threads character limit */
export const THREADS_CHAR_LIMIT = 500;

/* ==========================================================================
   Helper Type for Creating New Blocks
   ========================================================================== */

export type NewContentBlock = Omit<ContentBlock, 'id' | 'createdAt' | 'updatedAt'>;
