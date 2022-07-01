module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['airbnb-typescript', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
        project: ['./tsconfig.root.json', './lib/*/tsconfig.json'],
    },
    plugins: ['import', '@typescript-eslint'],
    rules: {
        'indent': ['error', 4],
        'object-curly-spacing': ['error', 'never'],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/object-curly-spacing': ['error', 'never'],
        'react/jsx-filename-extension': 'off',
        'import/no-extraneous-dependencies': ['error', {devDependencies: ['vite.config.ts']}],
    },
};
