import { palette } from './palette.js';

export const tokenColors = [
  {
    "name": "Comments",
    "scope": [
      "comment",
      "punctuation.definition.comment"
    ],
    "settings": {
      "foreground": palette.comment
    }
  },
  {
    "name": "Keywords and storage",
    "scope": [
      "keyword",
      "storage"
    ],
    "settings": {
      "foreground": palette.keyword
    }
  },
  {
    "name": "Strings",
    "scope": "string",
    "settings": {
      "foreground": palette.string
    }
  },
  {
    "name": "Numbers and constants",
    "scope": [
      "constant.numeric",
      "constant.language"
    ],
    "settings": {
      "foreground": palette.constant
    }
  },
  {
    "name": "Functions",
    "scope": [
      "entity.name.function",
      "support.function"
    ],
    "settings": {
      "foreground": palette.function
    }
  },
  {
    "name": "Types",
    "scope": [
      "entity.name.type",
      "support.type",
      "support.class"
    ],
    "settings": {
      "foreground": palette.type
    }
  },
  {
    "name": "Variables",
    "scope": [
      "variable",
      "entity.other.attribute-name"
    ],
    "settings": {
      "foreground": palette.variable
    }
  },
  {
    "name": "Tags",
    "scope": "entity.name.tag",
    "settings": {
      "foreground": palette.keyword
    }
  },
  {
    "name": "Markdown headings",
    "scope": [
      "markup.heading",
      "entity.name.section"
    ],
    "settings": {
      "foreground": palette.keyword,
      "fontStyle": "bold"
    }
  },
  {
    "name": "Invalid tokens",
    "scope": "invalid",
    "settings": {
      "foreground": palette.invalid
    }
  }
];

export const semanticTokenColors = {
  "type": palette.type,
  "class": palette.type,
  "interface": palette.type,
  "enum": palette.type,
  "typeParameter": palette.type,
  "function": palette.function,
  "method": palette.function,
  "variable": palette.variable,
  "parameter": palette.variable,
  "property": palette.variable,
  "enumMember": palette.constant
};
