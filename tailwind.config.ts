import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 Configuration
 * 
 * Note: In Tailwind v4, most configuration is done via CSS with @theme directive.
 * This file exists for compatibility and advanced configuration options.
 * The primary design system tokens are defined in globals.css.
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // These reference the CSS custom properties defined in globals.css
        // Providing fallback hex values for better IDE support
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 0.25rem)",
        DEFAULT: "var(--radius)",
        md: "var(--radius)",
        lg: "calc(var(--radius) + 0.25rem)",
        xl: "calc(var(--radius) + 0.5rem)",
        "2xl": "calc(var(--radius) + 1rem)",
      },
      boxShadow: {
        card: "0 2px 8px -2px rgb(0 0 0 / 0.08), 0 4px 16px -4px rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
