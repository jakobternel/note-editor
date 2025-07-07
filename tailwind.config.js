/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ["var(--font-heading)", "sans-serif"],
                main: ["var(--font-main)", "sans-serif"],
                code: ["var(--font-code)", "monospace"],
            },
        },
    },
    plugins: [],
};
