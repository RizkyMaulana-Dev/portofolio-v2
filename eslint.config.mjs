{
  "extends": ["@astrojs/astro/base", "@astrojs/react/base", "prettier"],
  "plugins": ["react-refresh"],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true }
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "no-unused-vars": "warn",
  },
  "ignores": ["dist/**", ".astro/**", "node_modules/**"],
}