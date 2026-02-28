/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#3b82f6',  // your blue
                    hover: '#2563eb',
                },
            },
        },
    },
    plugins: [],
}