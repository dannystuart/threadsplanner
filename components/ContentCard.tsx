'use client';

import { Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlannerStore } from '@/store/usePlannerStore';
import { ContentBlock, ContentType } from '@/types';
import { ViewMode } from '@/store/useViewStore';
import confetti from 'canvas-confetti';

/* ==========================================================================
   Content Type Styling & Labels
   ========================================================================== */

const typeStyles: Record<ContentType, { bg: string; label: string }> = {
    [ContentType.TEXT]: {
        bg: 'bg-[var(--content-text)]',
        label: 'Text',
    },
    [ContentType.CREATIVE]: {
        bg: 'bg-[var(--content-creative)]',
        label: 'Creative',
    },
    [ContentType.RECYCLED]: {
        bg: 'bg-[var(--content-recycled)]',
        label: 'Recycled',
    },
    [ContentType.FLEXIBLE]: {
        bg: 'bg-[var(--content-flexible)]',
        label: 'Flexible',
    },
};

// Tag colors by content type - using Figma design colors
const tagStyles: Record<ContentType, string> = {
    [ContentType.TEXT]: 'bg-[var(--content-text-tag-bg)] text-[var(--content-text-tag-fg)]',
    [ContentType.CREATIVE]: 'bg-[var(--content-creative-tag-bg)] text-[var(--content-creative-tag-fg)]',
    [ContentType.RECYCLED]: 'bg-[var(--content-recycled-tag-bg)] text-[var(--content-recycled-tag-fg)]',
    [ContentType.FLEXIBLE]: 'bg-[var(--content-flexible-tag-bg)] text-[var(--content-flexible-tag-fg)]',
};

/* ==========================================================================
   ContentCard Component
   ========================================================================== */

interface ContentCardProps {
    block: ContentBlock;
    viewMode?: ViewMode;
    onEdit?: (block: ContentBlock) => void;
    className?: string;
}

export function ContentCard({ block, viewMode = 'default', onEdit, className }: ContentCardProps) {
    const toggleDone = usePlannerStore((state) => state.toggleDone);
    const typeConfig = typeStyles[block.type];
    const tagStyle = tagStyles[block.type];
    const isMini = viewMode === 'mini';

    const handleCheckboxChange = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        // Trigger confetti only when marking as done (reduced in mini mode)
        if (!block.isDone) {
            const rect = e.currentTarget.getBoundingClientRect();
            // Calculate normalized coordinates (0-1) for the center of the checkbox
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            // Fire confetti from the global instance
            confetti({
                particleCount: isMini ? 25 : 50,
                spread: isMini ? 40 : 60,
                origin: { x, y },
                colors: ['#FCFB63', '#FFFFFF', '#000000'],
                disableForReducedMotion: true,
                scalar: isMini ? 0.6 : 0.8,
                ticks: 200,
                gravity: 1.2,
                decay: 0.94,
                startVelocity: isMini ? 18 : 25,
                shapes: ['square', 'circle']
            });
        }

        toggleDone(block.id);
    };

    // Mini mode: Compact single-row layout with just type label + checkbox
    if (isMini) {
        return (
            <div
                onClick={() => onEdit?.(block)}
                className={cn(
                    'group relative flex items-center justify-between rounded-lg px-3 py-2.5 shadow-sm transition-all duration-200',
                    'hover:shadow-md cursor-pointer',
                    typeConfig.bg,
                    'text-[var(--foreground)]',
                    block.isDone && 'opacity-50',
                    className
                )}
            >
                {/* Type Label */}
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    {typeConfig.label}
                </span>

                {/* Checkbox */}
                <div
                    onClick={handleCheckboxChange}
                    className="flex items-center cursor-pointer"
                >
                    <div
                        className={cn(
                            'h-4 w-4 rounded border-2 flex items-center justify-center transition-colors',
                            block.isDone
                                ? 'bg-foreground border-foreground'
                                : 'border-foreground/30 hover:border-foreground/50'
                        )}
                    >
                        {block.isDone && (
                            <svg className="h-2.5 w-2.5 text-background" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M2 6L5 9L10 3"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Default mode: Full card layout
    return (
        <div
            onClick={() => onEdit?.(block)}
            className={cn(
                'group relative flex min-h-[100px] flex-col rounded-xl p-3 shadow-sm transition-all duration-200',
                'hover:shadow-md cursor-pointer',
                typeConfig.bg,
                'text-[var(--foreground)]',
                block.isDone && 'opacity-50',
                className
            )}
        >
            {/* Header: Type Label + Promo Badge */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    {typeConfig.label}
                </span>
                {block.isPromotional && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                        <Megaphone className="h-3 w-3" />
                        Promo
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold leading-tight line-clamp-2 flex-1">
                {block.title || <span className="italic opacity-50">Untitled</span>}
            </h3>

            {/* Footer: Tags + Checkbox */}
            <div className="flex items-end justify-between mt-2 pt-2 border-t border-black/5">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {block.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className={cn(
                                'rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                                tagStyle
                            )}
                        >
                            {tag}
                        </span>
                    ))}
                    {block.tags.length > 2 && (
                        <span className="text-[10px] opacity-50">
                            +{block.tags.length - 2}
                        </span>
                    )}
                </div>

                {/* Checkbox */}
                <div
                    onClick={handleCheckboxChange}
                    className="flex items-center gap-1.5 cursor-pointer"
                >
                    <span className="text-[10px] font-medium opacity-50 uppercase tracking-wider">
                        {block.isDone ? 'Done' : ''}
                    </span>
                    <div
                        className={cn(
                            'h-6 w-6 rounded border-2 flex items-center justify-center transition-colors',
                            block.isDone
                                ? 'bg-foreground border-foreground'
                                : 'border-foreground/30 hover:border-foreground/50'
                        )}
                    >
                        {block.isDone && (
                            <svg className="h-3.5 w-3.5 text-background" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M2 6L5 9L10 3"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

