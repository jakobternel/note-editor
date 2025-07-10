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
            colors: {
                // General colours
                primary: "var(--color-primary)",
                background: "var(--color-background)",
                surface: "var(--color-surface)",
                accent: "var(--color-accent)",
                textPrimary: "var(--color-text-primary)",
                textSecondary: "var(--color-text-secondary)",
                textInverse: "var(--color-text-inverse)",
                border: "var(--color-border)",

                // Form inputs
                formInputBackground: "var(--color-input-bg)",
                formInputBorder: "var(--color-input-border)",
                formInputText: "var(--color-input-text)",
                formInputPlaceholder: "var(--color-input-placeholder)",
                formInputFocus: "var(--color-input-focus)",

                // Buttons
                buttonBackground: "var(--color-button-bg)",
                buttonHover: "var(--color-button-hover)",
                buttonText: "var(--color-button-text)",
            },
            borderWidth: {
                1: "1px",
            },
            boxShadow: {
                formXS: "0 1px 2px 0 var(--color-input-glow)",
            },
        },
    },
    plugins: [],
};
