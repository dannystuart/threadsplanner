'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerSwatchProps {
    color: string;
    label: string;
    onChange: (newColor: string) => void;
    className?: string;
}

/**
 * A clickable color swatch that opens a native color picker.
 * Shows the current color and allows editing via picker or hex input.
 */
export function ColorPickerSwatch({
    color,
    label,
    onChange,
    className,
}: ColorPickerSwatchProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={cn('relative', className)}>
            {/* Hidden native color input */}
            <input
                ref={inputRef}
                type="color"
                value={color}
                onChange={handleChange}
                className="sr-only"
                aria-label={`Pick color for ${label}`}
            />

            {/* Clickable swatch */}
            <button
                type="button"
                onClick={handleClick}
                className={cn(
                    'group flex w-full flex-col gap-2 rounded-xl p-3 text-left transition-all',
                    'border border-border bg-card hover:shadow-md hover:scale-[1.02]',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                )}
            >
                {/* Color preview */}
                <div
                    className="h-12 w-full rounded-lg border border-black/10 transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: color }}
                />

                {/* Label and hex value */}
                <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                        {label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground uppercase">
                        {color}
                    </span>
                </div>
            </button>
        </div>
    );
}
