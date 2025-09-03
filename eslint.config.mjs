// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Resolve __dirname since we're using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat allows using traditional `extends`
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Export the config
export default [
  // Compatibility layer with Next.js ESLint configs
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
    // Add more if needed, e.g., "eslint:recommended"
  ),

  // Ignore specific files/folders
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.config.js", // Optional: ignore config files
    ],
  },

  // Optional: custom rules or overrides
  {
    rules: {
      // Example rules (customize as needed)
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
