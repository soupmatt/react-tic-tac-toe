module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react"],
  ignorePatterns: ["dist/**/*.js"],
  rules: {
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "prefer-const": "error",
    "no-var": "error",
    eqeqeq: "error",
  },
  settings: {
    react: {
      version: "latest",
    },
  },
};
