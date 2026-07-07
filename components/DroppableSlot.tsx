'use client';

import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { ViewMode } from '@/store/useViewStore';

interface DroppableSlotProps {
    id: string;
    children: React.ReactNode;
    isEmpty?: boolean;
    viewMode?: ViewMode;
    onAddBlock?: () => void;
    className?: string;
}

/**
 * A droppable time slot that can receive dragged ContentCards
 * Shows a plus button when empty and hovered
 */
export function DroppableSlot({
    id,
    children,
    isEmpty = false,
    viewMode = 'default',
    onAddBlock,
    className
}: DroppableSlotProps) {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    const isMini = viewMode === 'mini';

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'group/slot relative rounded-xl border border-dashed transition-all duration-200',
                isMini ? 'p-1' : 'p-2',
                // Highlight when dragging over
                isOver && 'border-[#6E8778] bg-[#6E8778]/20 scale-[1.01]',
                // Default state
                !isOver && 'border-border/40 bg-muted/10',
                // Hover state for empty slots
                isEmpty && !isOver && 'hover:border-[#6E8778]/50 hover:bg-[#6E8778]/5',
                className
            )}
        >
            {children}

            {/* Add Block Button - Only visible on empty slots when hovered */}
            {isEmpty && onAddBlock && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddBlock();
                    }}
                    className={cn(
                        'absolute inset-0 flex items-center justify-center',
                        'opacity-0 group-hover/slot:opacity-100 transition-opacity duration-200',
                        'focus:opacity-100'
                    )}
                >
                    <div className={cn(
                        'flex items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-background/80 text-muted-foreground hover:border-[#6E8778] hover:text-[#6E8778] hover:bg-[#6E8778]/10 transition-colors',
                        isMini ? 'h-6 w-6' : 'h-8 w-8'
                    )}>
                        <Plus className={isMini ? 'h-3 w-3' : 'h-4 w-4'} />
                    </div>
                </button>
            )}
        </div>
    );
}

