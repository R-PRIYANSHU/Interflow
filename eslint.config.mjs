import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "react-hooks/exhaustive-deps": "off", // Disable useEffect dependency warnings
      "@typescript-eslint/no-explicit-any": "off", // Allow any type in catch blocks
    },
  },
];

export default eslintConfig;
