module.exports = {
  extends: [
    "plugin:astro/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  parser: "astro-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    extraFileExtensions: [".astro"],
  },
  plugins: ["astro", "react-refresh"],
  rules: {
    "astro/no-set-text-directive": "warn",
    "astro/missing-client-only-directive-value": "warn",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};