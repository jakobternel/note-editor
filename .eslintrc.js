module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    plugins: [
        "@typescript-eslint",
        "react",
        "react-hooks",
        "prettier",
        "tailwindcss",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended",
        "plugin:tailwindcss/recommended",
    ],
    rules: {
        "react/react-in-jsx-scope": "off",
        "prettier/prettier": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "tailwindcss/classnames-order": "warn",
    },
    settings: {
        react: { version: "detect" },
        tailwindcss: {
            config: "./tailwind.config.js",
        },
    },
    overrides: [
        {
            files: [
                "src/pages/**/*.{js,ts,jsx,tsx}",
                "src/components/**/*.{js,ts,jsx,tsx}",
            ],
            rules: {
                "no-console": ["error", { allow: ["warn", "error"] }],
            },
        },
    ],
};
