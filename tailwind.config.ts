import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Safelist classes for the AI Resume Builder
    'p-8', 'font-sans', 'text-base', 'text-gray-800', 'bg-white', 'h-full',
    'text-3xl', 'font-bold', 'text-center', 'text-gray-900',
    'text-center', 'text-gray-600',
    'text-xl', 'font-bold', 'border-b-2', 'border-gray-300', 'pb-1', 'mt-6', 'mb-3', 'text-gray-800',
    'mb-4',
    'font-semibold', 'text-lg',
    'text-gray-600',
    'text-sm', 'text-gray-500',
    'p-10', 'font-serif', 'bg-white', 'h-full',
    'text-center', 'mb-10',
    'text-4xl', 'tracking-widest', 'font-light', 'uppercase',
    'text-sm', 'tracking-wider', 'text-gray-500',
    'text-lg', 'font-medium', 'tracking-widest', 'uppercase', 'text-gray-600', 'border-b', 'border-gray-200', 'pb-2', 'mb-6',
    'mb-6', 'flex', 'justify-between',
    'font-semibold', 'text-lg',
    'text-gray-600',
    'text-right', 'text-sm', 'text-gray-500',
    'bg-gray-100', 'text-gray-700', 'px-3', 'py-1', 'rounded-full', 'text-xs', 'font-medium',
    // Graphical style safelist
    'font-sans', 'bg-white', 'h-full',
    'bg-gradient-to-r', 'from-primary', 'to-accent', 'text-white', 'p-8', 'text-center',
    'text-4xl', 'font-bold', 'text-xl', 'text-primary-foreground/90',
    'flex',
    'w-1/3', 'bg-gray-100', 'text-gray-700', 'p-6',
    'flex', 'items-center', 'mb-2',
    'h-4', 'w-4', 'mr-2', 'text-primary',
    'text-lg', 'font-bold', 'uppercase', 'text-primary', 'tracking-wider', 'mt-6', 'mb-3', 'border-b-2', 'border-accent', 'pb-1',
    'mb-3', 'text-sm',
    'bg-gray-300', 'h-2', 'rounded-full',
    'bg-gradient-to-r', 'from-primary', 'to-accent', 'h-2', 'rounded-full',
    'w-2/3', 'p-6',
    'text-2xl', 'font-bold', 'text-primary', 'mb-4', 'flex', 'items-center',
    'h-6', 'w-6', 'mr-3', 'text-accent',
    'mb-6', 'relative', 'pl-8', 'before:absolute', 'before:left-3', 'before:top-2', 'before:h-full', 'before:w-0.5', 'before:bg-gray-200',
    'absolute', 'left-1.5', 'top-2.5', 'h-3', 'w-3', 'rounded-full', 'bg-accent', 'border-2', 'border-white',
    'text-xl', 'font-semibold',
    'text-gray-600', 'mb-1',
    'text-sm', 'text-gray-500',
    'mt-2', 'text-gray-700', 'text-sm'
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-source-code-pro)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
