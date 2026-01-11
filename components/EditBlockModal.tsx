'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Megaphone, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlannerStore } from '@/store/usePlannerStore';
import { useTagStore } from '@/store/useTagStore';
import {
    ContentBlock,
    ContentType,
    TimeSlot,
    RECYCLED_TAGS,
    FLEXIBLE_TAGS,
    THREADS_CHAR_LIMIT,
} from '@/types';

/* ==========================================================================
   Type Selector Options
   ========================================================================== */

const typeOptions: { value: ContentType; label: string; description: string; bgClass: string; tagBgClass: string }[] = [
    { value: ContentType.TEXT, label: 'Text Thread', description: 'Text-only posts', bgClass: 'bg-[var(--content-text)]', tagBgClass: 'bg-[var(--content-text-tag-bg)]' },
    { value: ContentType.CREATIVE, label: 'Creative', description: 'Visual content', bgClass: 'bg-[var(--content-creative)]', tagBgClass: 'bg-[var(--content-creative-tag-bg)]' },
    { value: ContentType.RECYCLED, label: 'Recycled', description: 'Repurposed content', bgClass: 'bg-[var(--content-recycled)]', tagBgClass: 'bg-[var(--content-recycled-tag-bg)]' },
    { value: ContentType.FLEXIBLE, label: 'Flexible', description: 'Trending topics', bgClass: 'bg-[var(--content-flexible)]', tagBgClass: 'bg-[var(--content-flexible-tag-bg)]' },
];

/* ==========================================================================
   EditBlockModal Component
   ========================================================================== */

interface EditBlockModalProps {
    /** Block to edit, or null for creating new block */
    block: ContentBlock | null;
    /** Date for new blocks (required when block is null) */
    defaultDate?: string;
    /** Time slot for new blocks */
    defaultTimeSlot?: TimeSlot;
    /** Called when modal should close */
    onClose: () => void;
}

export function EditBlockModal({
    block,
    defaultDate,
    defaultTimeSlot = 0,
    onClose,
}: EditBlockModalProps) {
    const addBlock = usePlannerStore((state) => state.addBlock);
    const updateBlock = usePlannerStore((state) => state.updateBlock);
    const deleteBlock = usePlannerStore((state) => state.deleteBlock);

    // Form state
    const [type, setType] = useState<ContentType>(block?.type ?? ContentType.TEXT);
    const [title, setTitle] = useState(block?.title ?? '');
    const [text, setText] = useState(block?.text ?? '');
    const [selectedTags, setSelectedTags] = useState<string[]>(block?.tags ?? []);
    const [customTag, setCustomTag] = useState('');
    const [isPromotional, setIsPromotional] = useState(block?.isPromotional ?? false);
    const [copied, setCopied] = useState(false);

    const isEditing = block !== null;

    // Get tags from global store for Text and Creative, use hardcoded for others
    const textTags = useTagStore((state) => state.textTags);
    const creativeTags = useTagStore((state) => state.creativeTags);
    const addGlobalTag = useTagStore((state) => state.addTag);

    // Available tags based on selected type
    const availableTags = (() => {
        switch (type) {
            case ContentType.TEXT:
                return textTags;
            case ContentType.CREATIVE:
                return creativeTags;
            case ContentType.RECYCLED:
                return [...RECYCLED_TAGS];
            case ContentType.FLEXIBLE:
                return [...FLEXIBLE_TAGS];
            default:
                return [];
        }
    })();

    // Reset tags when type changes (only for new blocks)
    useEffect(() => {
        if (!isEditing) {
            setSelectedTags([]);
        }
    }, [type, isEditing]);

    // Character count
    const charCount = text.length;
    const isOverLimit = charCount > THREADS_CHAR_LIMIT;

    // Handle tag toggle
    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    // Handle adding custom tag - also adds to global store for Text/Creative
    const addCustomTag = () => {
        const trimmed = customTag.trim();
        if (trimmed && !selectedTags.includes(trimmed)) {
            setSelectedTags((prev) => [...prev, trimmed]);
            // Add to global store if Text or Creative
            if (type === ContentType.TEXT) {
                addGlobalTag('text', trimmed);
            } else if (type === ContentType.CREATIVE) {
                addGlobalTag('creative', trimmed);
            }
            setCustomTag('');
        }
    };

    // Handle save
    const handleSave = () => {
        if (isOverLimit || !title.trim()) return;

        if (isEditing) {
            // Update existing block (type cannot be changed)
            updateBlock(block.id, {
                title,
                text,
                tags: selectedTags,
                isPromotional,
            });
        } else {
            // Create new block
            const date = defaultDate ?? new Date().toISOString().split('T')[0];
            addBlock({
                type,
                title,
                text,
                tags: selectedTags,
                isPromotional,
                isDone: false,
                date,
                timeSlot: defaultTimeSlot,
            });
        }
        onClose();
    };

    // Handle keydown for form submission
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSave();
        }
    };

    // Handle delete
    const handleDelete = () => {
        if (block) {
            deleteBlock(block.id);
            onClose();
        }
    };

    // Handle copy content
    const handleCopy = () => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="w-full max-w-lg rounded-2xl bg-background shadow-2xl border border-border overflow-hidden"
                onKeyDown={(e) => {
                    // Make Enter key submit only if not in textarea or custom tag input
                    if (e.key === 'Enter' &&
                        !e.shiftKey &&
                        (e.target as HTMLElement).tagName !== 'TEXTAREA' &&
                        (e.target as HTMLElement).id !== 'custom-tag-input'
                    ) {
                        e.preventDefault();
                        handleSave();
                    }
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-xl font-bold text-foreground">
                        {isEditing ? 'Edit Content Block' : 'New Content Block'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                    {/* 1. Content Type (Moved to Top) */}
                    {isEditing ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground mb-1 block">
                                Content Type
                            </label>
                            <div className="rounded-lg border border-border bg-muted/30 p-3">
                                <div className="font-medium text-foreground">
                                    {typeOptions.find((o) => o.value === type)?.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Type cannot be changed after creation
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground mb-1 block">
                                Content Type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {typeOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setType(opt.value)}
                                        className={cn(
                                            'rounded-lg border p-3 text-left transition-all',
                                            opt.bgClass,
                                            type === opt.value
                                                ? 'border-foreground/30 ring-2 ring-foreground/20'
                                                : 'border-transparent hover:border-foreground/20'
                                        )}
                                    >
                                        <div className="font-medium text-foreground">{opt.label}</div>
                                        <div className="text-xs text-muted-foreground">{opt.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. Title (with mandatory label) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground mb-1 block">
                            Title <span className="text-muted-foreground font-normal">(mandatory)</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a title for this content..."
                            autoFocus
                            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>

                    {/* 3. Tags Selector */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground mb-1 block">
                            Tags <span className="text-muted-foreground font-normal">(select or add custom)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => {
                                const currentTypeConfig = typeOptions.find(o => o.value === type);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={cn(
                                            'rounded-full px-3 py-1 text-sm font-medium transition-all',
                                            selectedTags.includes(tag)
                                                ? `${currentTypeConfig?.tagBgClass} text-foreground`
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        )}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                            {/* Custom tags */}
                            {selectedTags
                                .filter((tag) => !availableTags.includes(tag))
                                .map((tag) => {
                                    const currentTypeConfig = typeOptions.find(o => o.value === type);
                                    return (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={cn(
                                                'rounded-full px-3 py-1 text-sm font-medium text-foreground',
                                                currentTypeConfig?.tagBgClass
                                            )}
                                        >
                                            {tag} ×
                                        </button>
                                    );
                                })}
                        </div>
                        {/* Custom tag input */}
                        <div className="flex gap-2 mt-2">
                            <input
                                id="custom-tag-input"
                                type="text"
                                value={customTag}
                                onChange={(e) => setCustomTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                                placeholder="Add custom tag..."
                                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                            <button
                                type="button"
                                onClick={addCustomTag}
                                disabled={!customTag.trim()}
                                className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* 4. Promotional Toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3">
                            <Megaphone className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <div className="font-medium text-foreground">Promotional Content</div>
                                <div className="text-xs text-muted-foreground">Mark as promotional/sponsored</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPromotional(!isPromotional)}
                            className={cn(
                                'relative h-6 w-11 rounded-full transition-colors',
                                isPromotional ? 'bg-secondary' : 'bg-muted'
                            )}
                        >
                            <span
                                className={cn(
                                    'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                                    isPromotional && 'translate-x-5'
                                )}
                            />
                        </button>
                    </div>

                    {/* 5. Content Textarea (Moved to Bottom) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-medium text-foreground">
                                Content <span className="text-muted-foreground font-normal">(only visible when editing)</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        'text-xs font-medium',
                                        isOverLimit ? 'text-red-500' : 'text-muted-foreground'
                                    )}
                                >
                                    {charCount}/{THREADS_CHAR_LIMIT}
                                </span>
                                {/* Copy Button */}
                                {text && (
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-3 w-3" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3 w-3" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handleSave();
                                }
                            }}
                            placeholder="Write your Thread content here..."
                            rows={4}
                            className={cn(
                                'w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2',
                                isOverLimit
                                    ? 'border-red-500 focus:ring-red-500/50'
                                    : 'border-border focus:ring-secondary'
                            )}
                        />
                        <div className="text-[10px] text-muted-foreground text-right">
                            Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter to save
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/30">
                    {/* Delete Button (only for editing) */}
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    ) : (
                        <div /> // Empty spacer
                    )}

                    {/* Save Button */}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isOverLimit || !title.trim()}
                        className="rounded-lg bg-secondary px-6 py-2 text-sm font-medium text-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isEditing ? 'Save Changes' : 'Create Block'}
                    </button>
                </div>
            </div>
        </div>
    );
}
