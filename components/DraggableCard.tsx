'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { ContentBlock } from '@/types';

interface DraggableCardProps {
    block: ContentBlock;
    children: React.ReactNode;
}

/**
 * Wrapper that makes ContentCard both draggable AND droppable (for swapping)
 */
export function DraggableCard({ block, children }: DraggableCardProps) {
    // Make it draggable
    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
        transform,
        isDragging,
    } = useDraggable({
        id: block.id,
    });

    // Make it droppable (for swapping)
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: block.id,
    });

    // Combine refs
    const setNodeRef = (node: HTMLElement | null) => {
        setDraggableRef(node);
        setDroppableRef(node);
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                'transition-all duration-150',
                isOver && !isDragging && 'ring-2 ring-secondary scale-[1.02]'
            )}
        >
            {children}
        </div>
    );
}
