import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: { globals: globals.browser },
        rules: {
            'indent': ['warn', 4],
            'no-trailing-spaces': 'error',
            'no-multiple-empty-lines': 'error',
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'max-len': ['warn', 200],
            'eol-last': ['error', 'always'],
            'no-console': ['error', { 'allow': ['warn', 'error'] }],
            'comma-dangle': ['error', 'always-multiline'],
            'no-unused-vars': [
                'error',
                {
                    'vars': 'all',
                    'args': 'after-used',
                    'ignoreRestSiblings': false,
                    'varsIgnorePattern': '^_',
                    'argsIgnorePattern': '^_',
                },
            ],
            'one-var': ['error', 'never'],
        },
        ignores: ['scripts'],
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
];
