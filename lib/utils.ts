import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 * 
 * @param inputs - Class names to merge (strings, objects, arrays)
 * @returns Merged and deduplicated class string
 * 
 * @example
 * cn("px-2 py-1", "px-4") // "px-4 py-1" - tailwind-merge dedupes
 * cn("text-red-500", condition && "text-blue-500")
 * cn({ "bg-primary": isPrimary, "bg-secondary": !isPrimary })
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
