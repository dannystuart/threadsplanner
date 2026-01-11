'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PlannerGrid } from '@/components/PlannerGrid';
import { EditBlockModal } from '@/components/EditBlockModal';
import { TagManagerDropdown } from '@/components/TagManagerDropdown';
import { usePlannerStore } from '@/store/usePlannerStore';
import { ContentBlock, ContentType, TimeSlot } from '@/types';

/**
 * Main Planner Page with Grid and Edit Modal
 */
export default function PlannerPage() {
    const blocks = usePlannerStore((state) => state.blocks);
    const addBlock = usePlannerStore((state) => state.addBlock);
    const clearAllBlocks = usePlannerStore((state) => state.clearAllBlocks);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
    const [newBlockDate, setNewBlockDate] = useState<string | undefined>();
    const [newBlockTimeSlot, setNewBlockTimeSlot] = useState<TimeSlot>(0);

    // Seed with sample data if empty
    useEffect(() => {
        if (blocks.length === 0) {
            const todayDate = new Date();
            const todayStr = todayDate.toISOString().split('T')[0];

            const tomorrow = new Date(todayDate);
            tomorrow.setDate(todayDate.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            const dayAfter = new Date(todayDate);
            dayAfter.setDate(todayDate.getDate() + 2);
            const dayAfterStr = dayAfter.toISOString().split('T')[0];

            addBlock({
                type: ContentType.TEXT,
                title: 'Morning Motivation',
                text: 'Morning motivation post about pursuing your creative dreams.',
                tags: ['Encourage Dreams'],
                isPromotional: false,
                isDone: false,
                date: todayStr,
                timeSlot: 0 as TimeSlot,
            });

            addBlock({
                type: ContentType.CREATIVE,
                title: 'Design Process Reveal',
                text: 'Behind the scenes of my latest design project.',
                tags: ['Behind the Scenes', 'Process'],
                isPromotional: false,
                isDone: false,
                date: todayStr,
                timeSlot: 2 as TimeSlot,
            });

            addBlock({
                type: ContentType.RECYCLED,
                title: 'Best of Last Month',
                text: 'Throwback to one of my most popular posts.',
                tags: ['Evergreen'],
                isPromotional: false,
                isDone: true,
                date: tomorrowStr,
                timeSlot: 1 as TimeSlot,
            });

            addBlock({
                type: ContentType.FLEXIBLE,
                title: 'Design Trends Hot Take',
                text: 'Quick take on the latest design trends.',
                tags: ['Trending Topic'],
                isPromotional: false,
                isDone: false,
                date: dayAfterStr,
                timeSlot: 0 as TimeSlot,
            });

            addBlock({
                type: ContentType.TEXT,
                title: 'Course Launch Announcement',
                text: 'New course announcement! Early bird pricing available.',
                tags: ['Share Insight'],
                isPromotional: true,
                isDone: false,
                date: dayAfterStr,
                timeSlot: 2 as TimeSlot,
            });
        }
    }, [blocks.length, addBlock]);

    // Handle editing a block
    const handleEditBlock = (block: ContentBlock) => {
        setEditingBlock(block);
        setNewBlockDate(undefined);
        setIsModalOpen(true);
    };

    // Handle creating new block from header button
    const handleNewBlock = () => {
        setEditingBlock(null);
        setNewBlockDate(new Date().toISOString().split('T')[0]);
        setNewBlockTimeSlot(0);
        setIsModalOpen(true);
    };

    // Handle creating new block for specific slot
    const handleAddBlockToSlot = (date: string, timeSlot: TimeSlot) => {
        setEditingBlock(null);
        setNewBlockDate(date);
        setNewBlockTimeSlot(timeSlot);
        setIsModalOpen(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBlock(null);
        setNewBlockDate(undefined);
    };

    // Handle clearing all blocks
    const handleClearAll = () => {
        if (confirm('Clear all blocks? This cannot be undone.')) {
            clearAllBlocks();
        }
    };

    // Calculate stats
    const doneCount = blocks.filter((b) => b.isDone).length;

    return (
        <div className="min-h-screen bg-background">
            {/* Fixed Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Left: Title and Stats */}
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Twine Planner</h1>
                            <p className="text-sm text-muted-foreground">
                                {blocks.length} blocks · {doneCount} completed
                            </p>
                        </div>

                        {/* Center: Tag Managers */}
                        <div className="hidden sm:flex items-center gap-1 border-l border-r border-border px-4">
                            <TagManagerDropdown type="text" label="Text Tags" />
                            <TagManagerDropdown type="creative" label="Creative Tags" />
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClearAll}
                                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleNewBlock}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-foreground hover:opacity-90 transition-opacity"
                            >
                                <Plus className="h-4 w-4" />
                                New Block
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Planner Grid */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <PlannerGrid
                    onEditBlock={handleEditBlock}
                    onAddBlockToSlot={handleAddBlockToSlot}
                />
            </main>

            {/* Edit Modal */}
            {isModalOpen && (
                <EditBlockModal
                    block={editingBlock}
                    defaultDate={newBlockDate}
                    defaultTimeSlot={newBlockTimeSlot}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
