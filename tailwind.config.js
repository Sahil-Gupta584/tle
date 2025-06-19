import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './app/**/*.{js,ts,jsx,tsx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'tooltip-bg': 'rgb(var(--tooltip-bg) / <alpha-value>)',
        'tooltip-border': 'rgb(var(--tooltip-border) / <alpha-value>)',
        'tooltip-text': 'rgb(var(--tooltip-text) / <alpha-value>)',
      }
    },
  },
  plugins: [heroui()],
};