import { next } from "@eslint-config-next";

export default [
  ...next(),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "warn", // opsional: biar gak error waktu build
    },
  },
];
