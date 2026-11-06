import { designTokens as t, syntaxColors as s } from './palette.js';

export const tokenColors = [
  {
    name: 'Default syntax',
    scope: [
      'keyword', 'storage', 'constant', 'variable',
      'entity', 'support', 'meta', 'punctuation',
      'keyword.operator',
    ],
    settings: { foreground: t.textPrimary },
  },
  {
    name: 'Strings',
    scope: ['string'],
    settings: { foreground: s.string },
  },
  {
    name: 'String punctuation',
    scope: [
      'punctuation.definition.string',
      'punctuation.definition.template-expression',
    ],
    settings: { foreground: t.textPrimary },
  },
  {
    name: 'Comments',
    scope: ['comment'],
    settings: { foreground: s.comment },
  },
];

export const semanticTokenColors = {
  '*': t.textPrimary,
  comment: s.comment,
  string: s.string,
};
