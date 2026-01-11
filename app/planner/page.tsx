'use client';

import { useState, useEffect, useRef } from 'react';
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

    // Track if we've already seeded (prevent re-seeding after clear)
    const hasSeeded = useRef(false);

    // Seed with sample data if empty (only on first mount)
    useEffect(() => {
        if (blocks.length === 0 && !hasSeeded.current) {
            hasSeeded.current = true;

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
                title: 'fdfd',
                text: 'Morning motivation post about pursuing your creative dreams.',
                tags: ['Share Opinion', 'Spark Discussion'],
                isPromotional: false,
                isDone: false,
                date: todayStr,
                timeSlot: 0 as TimeSlot,
            });

            addBlock({
                type: ContentType.FLEXIBLE,
                title: 'sas',
                text: 'Behind the scenes of my latest design project.',
                tags: [],
                isPromotional: false,
                isDone: true,
                date: todayStr,
                timeSlot: 2 as TimeSlot,
            });
        } else if (blocks.length > 0) {
            // If we already have blocks (from localStorage), mark as seeded
            hasSeeded.current = true;
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
            {/* Fixed Header - Figma Design */}
            <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-[#F9F9F9]/95 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-8 py-5">
                    {/* Top Row: Logo and Actions */}
                    <div className="flex items-start justify-between">
                        {/* Left: Logo and Stats */}
                        <div className="flex flex-col gap-4 items-start">
                            {/* Logo */}
                            <img
                                src="/Logo.png"
                                alt="twine"
                                className="h-7 w-auto object-contain"
                            />
                            {/* Stats */}
                            <div className="flex flex-col text-[13px] text-[#6E8778]">
                                <span>{doneCount} posts completed</span>
                                <span>{blocks.length - doneCount} posts planned in next 4 weeks</span>
                            </div>
                        </div>

                        {/* Center: Tag Managers */}
                        <div className="hidden sm:flex items-center gap-4 self-end pb-1">
                            <TagManagerDropdown type="text" label="Text Tags" />
                            <TagManagerDropdown type="creative" label="Creative Tags" />
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end pb-1">
                            <button
                                onClick={handleClearAll}
                                className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] font-normal text-[#3E4040] hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleNewBlock}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#6E8778] px-4 py-2 text-[13px] font-normal text-white hover:opacity-90 transition-opacity"
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
