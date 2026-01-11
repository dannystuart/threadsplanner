'use client';

import { useMemo, useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from '@dnd-kit/core';
import { usePlannerStore } from '@/store/usePlannerStore';
import { ContentBlock, TimeSlot, TIME_SLOT_LABELS } from '@/types';
import { ContentCard } from '@/components/ContentCard';
import { DroppableSlot } from './DroppableSlot';
import { DraggableCard } from './DraggableCard';

/* ==========================================================================
   Date Utilities
   ========================================================================== */

function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
}

function generateFourWeeks(startDate: Date): Date[] {
    const monday = getMonday(startDate);
    const dates: Date[] = [];
    for (let i = 0; i < 28; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date);
    }
    return dates;
}

function groupIntoWeeks(dates: Date[]): Date[][] {
    const weeks: Date[][] = [];
    for (let i = 0; i < dates.length; i += 7) {
        weeks.push(dates.slice(i, i + 7));
    }
    return weeks;
}

function formatDateToISO(date: Date): string {
    return date.toISOString().split('T')[0];
}

function formatDateDisplay(date: Date): { day: string; date: number; month: string } {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        day: dayNames[date.getDay()],
        date: date.getDate(),
        month: monthNames[date.getMonth()],
    };
}

function formatWeekRange(weekDates: Date[]): string {
    const first = weekDates[0];
    const last = weekDates[weekDates.length - 1];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[first.getMonth()]} ${first.getDate()} - ${monthNames[last.getMonth()]} ${last.getDate()}`;
}

function parseSlotId(slotId: string): { date: string; timeSlot: TimeSlot } | null {
    const match = slotId.match(/^slot-(\d{4}-\d{2}-\d{2})-([012])$/);
    if (!match) return null;
    return {
        date: match[1],
        timeSlot: parseInt(match[2], 10) as TimeSlot,
    };
}

/* ==========================================================================
   PlannerGrid Component
   ========================================================================== */

interface PlannerGridProps {
    startDate?: Date;
    onEditBlock?: (block: ContentBlock) => void;
    /** Called when user clicks + on an empty slot */
    onAddBlockToSlot?: (date: string, timeSlot: TimeSlot) => void;
}

export function PlannerGrid({
    startDate = new Date(),
    onEditBlock,
    onAddBlockToSlot
}: PlannerGridProps) {
    // Generate 28 days from Monday of current week, grouped into weeks
    const weeks = useMemo(() => {
        const dates = generateFourWeeks(startDate);
        return groupIntoWeeks(dates);
    }, [startDate]);

    // Store
    const blocks = usePlannerStore((state) => state.blocks);
    const moveBlock = usePlannerStore((state) => state.moveBlock);

    // Drag state
    const [activeBlock, setActiveBlock] = useState<ContentBlock | null>(null);

    // Configure sensors for drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Group blocks by date and time slot for quick lookup
    const blocksBySlot = useMemo(() => {
        const map = new Map<string, ContentBlock[]>();
        blocks.forEach((block) => {
            const key = `${block.date}-${block.timeSlot}`;
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push(block);
        });
        return map;
    }, [blocks]);

    // Get blocks for a specific slot
    const getBlocksForSlot = (date: string, timeSlot: TimeSlot): ContentBlock[] => {
        return blocksBySlot.get(`${date}-${timeSlot}`) || [];
    };

    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        const blockId = event.active.id as string;
        const block = blocks.find((b) => b.id === blockId);
        if (block) {
            setActiveBlock(block);
        }
    };

    // Handle drag end - supports swapping
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveBlock(null);

        if (!over) return;

        const draggedBlockId = active.id as string;
        const targetId = over.id as string;

        // Check if dropped on another card (swap)
        const targetBlock = blocks.find((b) => b.id === targetId);
        if (targetBlock) {
            const draggedBlock = blocks.find((b) => b.id === draggedBlockId);
            if (draggedBlock && draggedBlock.id !== targetBlock.id) {
                moveBlock(draggedBlockId, targetBlock.date, targetBlock.timeSlot);
                moveBlock(targetBlock.id, draggedBlock.date, draggedBlock.timeSlot);
            }
            return;
        }

        // Dropped on a slot
        const parsed = parseSlotId(targetId);
        if (!parsed) return;

        moveBlock(draggedBlockId, parsed.date, parsed.timeSlot);
    };

    // Time slots
    const timeSlots: TimeSlot[] = [0, 1, 2];

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-8">
                {/* Header Row - Time Slot Labels with Icons (Figma Design) */}
                <div className="sticky top-[108px] z-10 grid grid-cols-[80px_1fr_1fr_1fr] gap-2 bg-[#F9F9F9]/95 backdrop-blur-sm py-3 border-b border-[#E5E7EB]">
                    <div /> {/* Empty cell for date column */}
                    {/* Morning */}
                    <div className="flex items-center justify-center gap-1">
                        <img src="/icons/sunrise.svg" alt="" className="h-5 w-5" />
                        <span className="text-[13px] font-normal text-[#6E8778]">Morning</span>
                    </div>
                    {/* Afternoon */}
                    <div className="flex items-center justify-center gap-1">
                        <img src="/icons/sun.svg" alt="" className="h-5 w-5" />
                        <span className="text-[13px] font-normal text-[#6E8778]">Afternoon</span>
                    </div>
                    {/* Evening */}
                    <div className="flex items-center justify-center gap-1">
                        <img src="/icons/moon.svg" alt="" className="h-5 w-5" />
                        <span className="text-[13px] font-normal text-[#6E8778]">Evening</span>
                    </div>
                </div>

                {/* Weeks */}
                {weeks.map((weekDates, weekIndex) => (
                    <div key={weekIndex} className="space-y-2">
                        {/* Week Header */}
                        <div className="border-b border-border pb-2 mb-3">
                            <h3 className="text-lg font-bold text-foreground">
                                Week {weekIndex + 1}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {formatWeekRange(weekDates)}
                            </p>
                        </div>

                        {/* Days in this week */}
                        <div className="space-y-1">
                            {weekDates.map((date) => {
                                const dateStr = formatDateToISO(date);
                                const display = formatDateDisplay(date);

                                return (
                                    <div
                                        key={dateStr}
                                        className="grid grid-cols-[80px_1fr_1fr_1fr] gap-2 rounded-lg p-2 hover:bg-muted/30 transition-colors"
                                    >
                                        {/* Date Label */}
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                                {display.day}
                                            </span>
                                            <span className="text-lg font-bold text-foreground">
                                                {display.date}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {display.month}
                                            </span>
                                        </div>

                                        {/* Time Slot Columns */}
                                        {timeSlots.map((slot) => {
                                            const slotId = `slot-${dateStr}-${slot}`;
                                            const slotBlocks = getBlocksForSlot(dateStr, slot);
                                            const isEmpty = slotBlocks.length === 0;

                                            return (
                                                <DroppableSlot
                                                    key={slotId}
                                                    id={slotId}
                                                    isEmpty={isEmpty}
                                                    onAddBlock={
                                                        isEmpty && onAddBlockToSlot
                                                            ? () => onAddBlockToSlot(dateStr, slot)
                                                            : undefined
                                                    }
                                                >
                                                    <div className="min-h-[80px] space-y-2">
                                                        {slotBlocks.map((block) => (
                                                            <DraggableCard key={block.id} block={block}>
                                                                <ContentCard
                                                                    block={block}
                                                                    onEdit={onEditBlock}
                                                                    className="cursor-grab active:cursor-grabbing"
                                                                />
                                                            </DraggableCard>
                                                        ))}
                                                    </div>
                                                </DroppableSlot>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeBlock ? (
                    <div className="opacity-90 rotate-2 scale-105">
                        <ContentCard block={activeBlock} className="shadow-xl" />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
