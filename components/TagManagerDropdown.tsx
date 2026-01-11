'use client';

import { useState, useRef, useEffect } from 'react';
import { Tag, Plus, X, Pencil, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTagStore } from '@/store/useTagStore';

interface TagManagerDropdownProps {
    type: 'text' | 'creative';
    label: string;
}

export function TagManagerDropdown({ type, label }: TagManagerDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [editingTag, setEditingTag] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const tags = useTagStore((state) =>
        type === 'text' ? state.textTags : state.creativeTags
    );
    const addTag = useTagStore((state) => state.addTag);
    const removeTag = useTagStore((state) => state.removeTag);
    const renameTag = useTagStore((state) => state.renameTag);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setEditingTag(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddTag = () => {
        if (newTag.trim()) {
            addTag(type, newTag.trim());
            setNewTag('');
        }
    };

    const handleStartEdit = (tag: string) => {
        setEditingTag(tag);
        setEditValue(tag);
    };

    const handleSaveEdit = () => {
        if (editingTag && editValue.trim()) {
            renameTag(type, editingTag, editValue.trim());
        }
        setEditingTag(null);
        setEditValue('');
    };

    const handleRemoveTag = (tag: string) => {
        removeTag(type, tag);
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    type === 'text'
                        ? 'text-foreground hover:bg-[var(--accent-yellow)]/20'
                        : 'text-foreground hover:bg-secondary/50',
                    isOpen && (type === 'text' ? 'bg-[var(--accent-yellow)]/20' : 'bg-secondary/50')
                )}
            >
                <Tag className="h-3.5 w-3.5" />
                {label}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-border bg-background shadow-lg z-50 overflow-hidden">
                    {/* Header */}
                    <div className="border-b border-border px-3 py-2 bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {label} Tags ({tags.length})
                        </p>
                    </div>

                    {/* Tag List */}
                    <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                        {tags.map((tag) => (
                            <div
                                key={tag}
                                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-colors"
                            >
                                {editingTag === tag ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                            className="flex-1 bg-background border border-border rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSaveEdit}
                                            className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span
                                            className={cn(
                                                'flex-1 text-sm font-medium rounded px-1.5 py-0.5',
                                                type === 'text'
                                                    ? 'bg-[var(--accent-yellow)]/30'
                                                    : 'bg-secondary/50'
                                            )}
                                        >
                                            {tag}
                                        </span>
                                        <button
                                            onClick={() => handleStartEdit(tag)}
                                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="p-1 rounded hover:bg-red-100 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                        {tags.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                                No tags yet
                            </p>
                        )}
                    </div>

                    {/* Add New Tag */}
                    <div className="border-t border-border p-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Add new tag..."
                                className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
                            />
                            <button
                                onClick={handleAddTag}
                                disabled={!newTag.trim()}
                                className="p-1.5 rounded-lg bg-secondary text-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
