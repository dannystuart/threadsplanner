/**
 * Design System Color Token Structure
 * This JSON structure represents all editable colors in the design system.
 * Copy this JSON and paste it to the agent to update globals.css.
 */

export interface DesignSystemColors {
    // Base
    background: string;
    foreground: string;

    // Primary/Accent
    primary: string;
    primaryForeground: string;

    // Secondary
    secondary: string;
    secondaryForeground: string;

    // Muted
    muted: string;
    mutedForeground: string;

    // Borders & Focus
    border: string;
    ring: string;

    // Content Types
    contentText: string;
    contentTextForeground: string;
    contentCreative: string;
    contentCreativeForeground: string;
    contentRecycled: string;
    contentRecycledForeground: string;
    contentFlexible: string;
    contentFlexibleForeground: string;

    // Accent Yellow (for badges/tags)
    accentYellow: string;
    accentYellowForeground: string;
}

/**
 * Default design system colors - matches current globals.css (Figma Design)
 */
export const defaultDesignSystemColors: DesignSystemColors = {
    // Base
    background: '#F9F9F9',
    foreground: '#3E4040',

    // Primary/Accent
    primary: '#FCFB63',
    primaryForeground: '#3E4040',

    // Secondary (Sage Green)
    secondary: '#DCECDA',
    secondaryForeground: '#3E4040',

    // Muted
    muted: '#E2E4D8',
    mutedForeground: '#6E8778',

    // Borders & Focus
    border: '#E5E7EB',
    ring: '#FCFB63',

    // Content Types (Figma Design)
    contentText: '#F0EFEB',
    contentTextForeground: '#3E4040',
    contentCreative: '#DCECDA',
    contentCreativeForeground: '#3E4040',
    contentRecycled: '#F0EFEB',
    contentRecycledForeground: '#3E4040',
    contentFlexible: '#F0EFEB',
    contentFlexibleForeground: '#3E4040',

    // Accent Yellow
    accentYellow: '#FCFB63',
    accentYellowForeground: '#3E4040',
};

/**
 * Human-readable labels for each color token
 */
export const colorLabels: Record<keyof DesignSystemColors, string> = {
    background: 'Background',
    foreground: 'Foreground (Text)',
    primary: 'Primary',
    primaryForeground: 'Primary Foreground',
    secondary: 'Secondary',
    secondaryForeground: 'Secondary Foreground',
    muted: 'Muted',
    mutedForeground: 'Muted Foreground',
    border: 'Border',
    ring: 'Focus Ring',
    contentText: 'Text Thread',
    contentTextForeground: 'Text Thread Foreground',
    contentCreative: 'Creative',
    contentCreativeForeground: 'Creative Foreground',
    contentRecycled: 'Recycled',
    contentRecycledForeground: 'Recycled Foreground',
    contentFlexible: 'Flexible',
    contentFlexibleForeground: 'Flexible Foreground',
    accentYellow: 'Accent Yellow',
    accentYellowForeground: 'Accent Yellow Foreground',
};

/**
 * Group colors for organized display
 */
export const colorGroups = {
    base: ['background', 'foreground'] as const,
    brand: ['primary', 'primaryForeground', 'secondary', 'secondaryForeground'] as const,
    ui: ['muted', 'mutedForeground', 'border', 'ring'] as const,
    contentTypes: [
        'contentText', 'contentTextForeground',
        'contentCreative', 'contentCreativeForeground',
        'contentRecycled', 'contentRecycledForeground',
        'contentFlexible', 'contentFlexibleForeground',
    ] as const,
    accent: ['accentYellow', 'accentYellowForeground'] as const,
};
