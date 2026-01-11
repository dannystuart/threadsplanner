import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Card Variants
   Matches the reference design with multiple background color options
   ========================================================================== */

const cardVariants = cva(
    // Base styles - all cards share these
    "rounded-[var(--radius-xl)] border transition-all duration-200",
    {
        variants: {
            variant: {
                // Default white card with subtle shadow
                default:
                    "bg-card text-card-foreground border-border shadow-card",

                // Primary - vibrant yellow-lime (like calendar card in reference)
                primary:
                    "bg-primary text-primary-foreground border-primary/20 shadow-card",

                // Secondary - soft sage green (like indicators card in reference)
                secondary:
                    "bg-secondary text-secondary-foreground border-secondary/20 shadow-card",

                // Accent - clean white with stronger shadow
                accent:
                    "bg-accent text-accent-foreground border-border shadow-lg",

                // Muted - subtle gray background
                muted:
                    "bg-muted text-muted-foreground border-muted/50",

                // Ghost - transparent with border
                ghost:
                    "bg-transparent border-border/50 hover:bg-muted/50",
            },
            size: {
                sm: "p-4",
                default: "p-6",
                lg: "p-8",
            },
            hover: {
                none: "",
                lift: "hover:-translate-y-1 hover:shadow-xl",
                glow: "hover:shadow-[0_0_20px_rgba(197,217,195,0.3)]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            hover: "none",
        },
    }
);

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, size, hover, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, size, hover, className }))}
            {...props}
        />
    )
);
Card.displayName = "Card";

/* ==========================================================================
   Card Sub-Components
   ========================================================================== */

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-xl font-semibold leading-tight tracking-tight",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-4", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    cardVariants,
};
