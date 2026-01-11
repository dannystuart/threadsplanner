'use client';

import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DroppableSlotProps {
    id: string;
    children: React.ReactNode;
    isEmpty?: boolean;
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
    onAddBlock,
    className
}: DroppableSlotProps) {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'group/slot relative rounded-xl border border-dashed p-2 transition-all duration-200',
                // Highlight when dragging over
                isOver && 'border-secondary bg-secondary/10 scale-[1.01]',
                // Default state
                !isOver && 'border-border/40 bg-muted/10',
                // Hover state for empty slots
                isEmpty && !isOver && 'hover:border-secondary/50 hover:bg-secondary/5',
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-background/80 text-muted-foreground hover:border-secondary hover:text-secondary hover:bg-secondary/10 transition-colors">
                        <Plus className="h-4 w-4" />
                    </div>
                </button>
            )}
        </div>
    );
}
