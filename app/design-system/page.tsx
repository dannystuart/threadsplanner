'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ContentCard } from '@/components/ContentCard';
import { ContentType, ContentBlock } from '@/types';

/* ==========================================================================
   Sample Data for Preview
   ========================================================================== */


const sampleBlocks: ContentBlock[] = [
    {
        id: '1',
        type: ContentType.TEXT,
        title: 'AI and Creativity Thoughts',
        text: 'Just had the most incredible conversation about AI and creativity. The future is not about replacement—it\'s about amplification. What are your thoughts?',
        tags: ['Encourage Dreams'],
        isPromotional: false,
        isDone: false,
        date: '2026-01-10',
        timeSlot: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        type: ContentType.CREATIVE,
        title: 'Design Process Reveal',
        text: 'Behind the scenes of my latest design project. Swipe to see the process from sketch to final →',
        tags: ['Behind the Scenes', 'Process'],
        isPromotional: false,
        isDone: false,
        date: '2026-01-10',
        timeSlot: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        type: ContentType.RECYCLED,
        title: 'Timeless Insights',
        text: 'This post from last year still resonates. Sometimes the best insights are timeless.',
        tags: ['Evergreen'],
        isPromotional: true,
        isDone: false,
        date: '2026-01-10',
        timeSlot: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        type: ContentType.FLEXIBLE,
        title: 'Trending Topic',
        text: '',
        tags: ['Trending Topic'],
        isPromotional: false,
        isDone: true,
        date: '2026-01-11',
        timeSlot: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

/* ==========================================================================
   Design System Preview Page
   ========================================================================== */

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen p-8">
            <div className="mx-auto max-w-6xl space-y-12">
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold">Twine Design System</h1>
                        <p className="text-lg text-muted-foreground">
                            Visual reference for colors, components, and patterns
                        </p>
                    </div>
                    <a
                        href="/design-system/editor"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                    >
                        Open Editor →
                    </a>
                </header>

                {/* Color Palette */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Color Palette</h2>

                    {/* Base Colors */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Base Colors</h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <ColorSwatch name="Background" variable="--background" />
                            <ColorSwatch name="Foreground" variable="--foreground" />
                            <ColorSwatch name="Primary (Yellow)" variable="--primary" />
                            <ColorSwatch name="Secondary (Sage)" variable="--secondary" />
                            <ColorSwatch name="Muted" variable="--muted" />
                            <ColorSwatch name="Border" variable="--border" />
                            <ColorSwatch name="Ring (Focus)" variable="--ring" />
                            <ColorSwatch name="Accent Yellow" variable="--accent-yellow" />
                        </div>
                    </div>

                    {/* Content Type Colors */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Content Type Colors</h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <ColorSwatch name="Text (Neutral)" variable="--content-text" />
                            <ColorSwatch name="Creative (Sage)" variable="--content-creative" />
                            <ColorSwatch name="Recycled (Grey)" variable="--content-recycled" />
                            <ColorSwatch name="Flexible (Slate)" variable="--content-flexible" />
                        </div>
                    </div>
                </section>

                {/* Card Variants */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Card Component</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card variant="default">
                            <CardHeader>
                                <CardTitle>Default Card</CardTitle>
                                <CardDescription>White background with subtle shadow</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">This is the default card style used for general content.</p>
                            </CardContent>
                        </Card>

                        <Card variant="primary">
                            <CardHeader>
                                <CardTitle>Primary Card</CardTitle>
                                <CardDescription>Yellow-lime background</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Used for highlighting important content.</p>
                            </CardContent>
                        </Card>

                        <Card variant="secondary">
                            <CardHeader>
                                <CardTitle>Secondary Card</CardTitle>
                                <CardDescription>Soft sage green background</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Used for supporting content.</p>
                            </CardContent>
                        </Card>

                        <Card variant="accent" hover="lift">
                            <CardHeader>
                                <CardTitle>Accent Card (Hover Me)</CardTitle>
                                <CardDescription>Clean white with lift effect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Features hover lift animation.</p>
                            </CardContent>
                        </Card>

                        <Card variant="muted">
                            <CardHeader>
                                <CardTitle>Muted Card</CardTitle>
                                <CardDescription>Subtle gray background</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Used for less prominent content.</p>
                            </CardContent>
                        </Card>

                        <Card variant="ghost">
                            <CardHeader>
                                <CardTitle>Ghost Card</CardTitle>
                                <CardDescription>Transparent with border</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Minimal visual weight.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Content Cards */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">ContentCard Component</h2>
                    <p className="text-muted-foreground">
                        Restored design with tags, content preview, and edit actions. Yellow is now an accent color.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {sampleBlocks.map((block) => (
                            <ContentCard
                                key={block.id}
                                block={block}
                                onEdit={(b) => alert(`Edit clicked for: ${b.type}`)}
                            />
                        ))}
                    </div>
                </section>

                {/* Typography */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Typography</h2>
                    <Card variant="default" size="lg">
                        <CardContent className="space-y-4 pt-0">
                            <h1 className="text-4xl font-bold">Heading 1</h1>
                            <h2 className="text-3xl font-semibold">Heading 2</h2>
                            <h3 className="text-2xl font-semibold">Heading 3</h3>
                            <h4 className="text-xl font-medium">Heading 4</h4>
                            <p className="text-base">Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p className="text-sm text-muted-foreground">Small/Muted text - Secondary information and descriptions</p>
                            <p className="text-xs">Extra small text - Timestamps and metadata</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Spacing & Radius */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Border Radius</h2>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-secondary text-xs">sm</div>
                        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-secondary text-xs">md</div>
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary text-xs">lg</div>
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-xs">xl</div>
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-xs">2xl</div>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-xs">full</div>
                    </div>
                </section>
            </div>
        </div>
    );
}

/* ==========================================================================
   Color Swatch Component
   ========================================================================== */

function ColorSwatch({ name, variable }: { name: string; variable: string }) {
    return (
        <div className="space-y-1.5">
            <div
                className="h-16 w-full rounded-lg border border-border shadow-sm"
                style={{ backgroundColor: `var(${variable})` }}
            />
            <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="font-mono text-xs text-muted-foreground">{variable}</p>
            </div>
        </div>
    );
}
