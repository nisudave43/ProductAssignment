import globals from 'globals';

import pluginJs from '@eslint/js';

import tseslint from 'typescript-eslint';

import pluginReact from 'eslint-plugin-react';

/**
 * Export an array of ESLint flat configuration objects.
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
    {
        // Specify the file patterns this config applies to, including JS, TS, and JSX/TSX files.
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],

        // Define global variables for browser environments (e.g., `window`, `document`).
        languageOptions: { globals: globals.browser },

        // Define linting rules to enforce code quality and consistency.
        rules: {
            // Enforce indentation of 4 spaces for better readability.
            'indent': ['warn', 4],

            // Disallow trailing spaces at the end of lines.
            'no-trailing-spaces': 'error',

            // Disallow multiple empty lines in the code.
            'no-multiple-empty-lines': 'error',

            // Enforce Unix-style line endings (`\n`).
            'linebreak-style': ['error', 'unix'],

            // Require single quotes for strings, except when avoiding escape sequences.
            'quotes': ['error', 'single'],

            // Require semicolons at the end of statements.
            'semi': ['error', 'always'],

            // Warn when a line exceeds 200 characters to improve readability.
            'max-len': ['warn', 200],

            // Ensure files end with a newline to comply with POSIX standards.
            'eol-last': ['error', 'always'],

            // Disallow `console.log` but allow `console.warn` and `console.error`.
            'no-console': ['error', { 'allow': ['warn', 'error'] }],

            // Require trailing commas in multiline objects, arrays, and function parameters.
            'comma-dangle': ['error', 'always-multiline'],

            // Disallow unused variables, except for those prefixed with `_` (commonly used for ignored variables).
            'no-unused-vars': [
                'error',
                {
                    'vars': 'all', // Applies rule to all variables.
                    'args': 'after-used', // Applies rule to function arguments only if they are unused after being defined.
                    'ignoreRestSiblings': false, // Ensures unused properties in object destructuring are flagged.
                    'varsIgnorePattern': '^_', // Allows unused variables prefixed with `_`.
                    'argsIgnorePattern': '^_', // Allows unused function arguments prefixed with `_`.
                },
            ],

            // Enforce separate declarations for variables (`let a; let b;` instead of `let a, b;`).
            'one-var': ['error', 'never'],
        },

        // Exclude the `scripts` directory from linting.
        ignores: ['scripts'],
    },

    // Apply ESLint's recommended JavaScript rules.
    pluginJs.configs.recommended,

    // Apply TypeScript ESLint's recommended rules.
    ...tseslint.configs.recommended,

    // Apply React ESLint plugin's recommended rules.
    pluginReact.configs.flat.recommended,
];
