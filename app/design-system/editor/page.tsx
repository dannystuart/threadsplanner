'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, RotateCcw, ArrowLeft } from 'lucide-react';
import { ColorPickerSwatch } from '@/components/ui/color-picker-swatch';
import {
    DesignSystemColors,
    defaultDesignSystemColors,
    colorLabels,
    colorGroups,
} from '@/types/design-system';

export default function DesignSystemEditorPage() {
    const [colors, setColors] = useState<DesignSystemColors>(defaultDesignSystemColors);
    const [copied, setCopied] = useState(false);

    const handleColorChange = useCallback(
        (key: keyof DesignSystemColors) => (newColor: string) => {
            setColors((prev) => ({ ...prev, [key]: newColor }));
        },
        []
    );

    const handleReset = () => {
        setColors(defaultDesignSystemColors);
    };

    const handleCopyJSON = async () => {
        const json = JSON.stringify(colors, null, 2);
        await navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const jsonOutput = JSON.stringify(colors, null, 2);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Back Link */}
                <a
                    href="/design-system"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Preview
                </a>

                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Design System Editor
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Click any color to edit. Copy JSON to update the project palette.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>
                        <button
                            onClick={handleCopyJSON}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Copy JSON
                                </>
                            )}
                        </button>
                    </div>
                </header>

                {/* Color Groups */}
                <div className="space-y-8">
                    {/* Base Colors */}
                    <ColorGroup
                        title="Base Colors"
                        keys={colorGroups.base}
                        colors={colors}
                        onChange={handleColorChange}
                    />

                    {/* Brand Colors */}
                    <ColorGroup
                        title="Brand Colors"
                        keys={colorGroups.brand}
                        colors={colors}
                        onChange={handleColorChange}
                    />

                    {/* UI Colors */}
                    <ColorGroup
                        title="UI Colors"
                        keys={colorGroups.ui}
                        colors={colors}
                        onChange={handleColorChange}
                    />

                    {/* Content Type Colors */}
                    <ColorGroup
                        title="Content Type Colors"
                        keys={colorGroups.contentTypes}
                        colors={colors}
                        onChange={handleColorChange}
                    />

                    {/* Accent Colors */}
                    <ColorGroup
                        title="Accent Colors"
                        keys={colorGroups.accent}
                        colors={colors}
                        onChange={handleColorChange}
                    />
                </div>

                {/* JSON Output */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">
                            JSON Output
                        </h2>
                        <span className="text-sm text-muted-foreground">
                            Copy this and paste it to the agent to update globals.css
                        </span>
                    </div>
                    <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-card p-4 font-mono text-sm text-foreground">
                        {jsonOutput}
                    </pre>
                </section>
            </div>
        </div>
    );
}

/* ==========================================================================
   Color Group Component
   ========================================================================== */

interface ColorGroupProps {
    title: string;
    keys: readonly (keyof DesignSystemColors)[];
    colors: DesignSystemColors;
    onChange: (key: keyof DesignSystemColors) => (color: string) => void;
}

function ColorGroup({ title, keys, colors, onChange }: ColorGroupProps) {
    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">{title}</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {keys.map((key) => (
                    <ColorPickerSwatch
                        key={key}
                        color={colors[key]}
                        label={colorLabels[key]}
                        onChange={onChange(key)}
                    />
                ))}
            </div>
        </section>
    );
}
