import eslintTypescriptParser from "@typescript-eslint/parser"
import eslintTypescriptPlugin from "@typescript-eslint/eslint-plugin"
import importPlugin from 'eslint-plugin-import';
import globals from "globals";

export default [
  // Parser Import
  {
    languageOptions: {
      parser: eslintTypescriptParser
    }
  },
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    files: ["**/*.ts"],
    plugins: {
      eslintTypescriptPlugin: eslintTypescriptPlugin
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        myCustomGlobal: "readonly"
      }
    }
  },
  {
    files: ["**/*.ts"],
    rules: {
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["return", "export"],
        },
      ],
      "arrow-parens": "error",
      "no-var": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      // "@typescript-eslint/adjacent-overload-signatures": "error",
      // "@typescript-eslint/array-type": "error",
      // "@typescript-eslint/ban-types": "error",
      "@typescript-eslint/consistent-type-assertions": "off",
      // "@typescript-eslint/explicit-function-return-type": "error",
      // "@typescript-eslint/explicit-member-accessibility": ["error", { overrides: { constructors: "off" } }],
      // "@typescript-eslint/naming-convention": [
      //   "error",
      //   {
      //     selector: ["variable"],
      //     modifiers: ["exported"],
      //     format: ["camelCase", "PascalCase"],
      //   },
      // ],
      // "@typescript-eslint/member-delimiter-style": "error",
      // "no-array-constructor": "off",
      // "@typescript-eslint/no-array-constructor": "error",
      // "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-inferrable-types": "off",
      // "@typescript-eslint/no-misused-new": "error",
      // "@typescript-eslint/no-namespace": "error",
      // "@typescript-eslint/no-non-null-assertion": "error",
      // "@typescript-eslint/no-parameter-properties": [
      //   "error",
      //   {
      //     allows: ["private readonly"],
      //   },
      // ],
      // "no-unused-vars": "off",
      // "@typescript-eslint/no-unused-vars": [
      //   "error",
      //   {
      //     argsIgnorePattern: "^_",
      //   },
      // ],
      // "no-use-before-define": "off",
      // "@typescript-eslint/no-use-before-define": "error",
      // "@typescript-eslint/no-var-requires": "error",
      // "@typescript-eslint/prefer-namespace-keyword": "error",
      // "@typescript-eslint/type-annotation-spacing": "error",
      "no-console": "error",
      "import/no-extraneous-dependencies": ["error"]
    }
  },
];