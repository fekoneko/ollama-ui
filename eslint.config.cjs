const { defineConfig, globalIgnores } = require("eslint/config");
const globals = require("globals");
const { fixupConfigRules } = require("@eslint/compat");
const tsParser = require("@typescript-eslint/parser");
const reactRefresh = require("eslint-plugin-react-refresh");
const checkFile = require("eslint-plugin-check-file");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
    },

    extends: fixupConfigRules(
      compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
      ),
    ),

    plugins: {
      "react-refresh": reactRefresh,
      "check-file": checkFile,
    },

    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{js,ts}": "KEBAB_CASE",
          "**/*/!(use-)*.{jsx,tsx,mdx,css}": "PASCAL_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],
      "no-extra-boolean-cast": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  globalIgnores([
    "**/node_modules",
    "**/dist",
    "eslint.config.cjs",
    "postcss.config.cjs",
  ]),
]);
