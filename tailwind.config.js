/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#0F172A', // Slate 900
                    light: '#1E293B', // Slate 800
                    dark: '#020617', // Slate 950
                },
                secondary: {
                    DEFAULT: '#B45309', // Amber 700
                    light: '#D97706', // Amber 600
                    dark: '#92400E', // Amber 800
                },
                surface: {
                    DEFAULT: '#FFFFFF',
                    alt: '#F8FAFC', // Slate 50
                }
            }
        },
    },
    plugins: [],
}
