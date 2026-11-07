import { tokens as t } from './palette.js';

export const tokenColors = [
  {
    name: 'General code',
    scope: ['source', 'meta.embedded', 'meta.template.expression', 'meta.fstring'],
    settings: { foreground: t.textPrimary },
  },
  {
    name: 'Operators and separators',
    scope: [
      'keyword.operator',
      'punctuation.terminator',
      'punctuation.separator',
    ],
    settings: { foreground: t.textSecondary },
  },
  {
    name: 'Parameters',
    scope: ['variable.parameter'],
    settings: { foreground: t.synVariable },
  },
  {
    name: 'Variables',
    scope: ['variable.other.readwrite', 'variable.other.local'],
    settings: { foreground: t.synVariable },
  },
  {
    name: 'Constants',
    scope: ['constant', 'constant.numeric', 'constant.language'],
    settings: { foreground: t.synConstant },
  },
  {
    name: 'Language keywords and types',
    scope: [
      'keyword',
      'storage.type',
      'storage.modifier',
      'entity.name.type',
      'support.type',
    ],
    settings: { foreground: t.synKeyword },
  },
  {
    name: 'Functions and calls',
    scope: [
      'entity.name.function',
      'variable.function',
      'support.function',
      'meta.function-call.generic.python',
    ],
    settings: { foreground: t.neon },
  },
  {
    name: 'Strings',
    scope: ['string'],
    settings: { foreground: t.synString },
  },
  {
    name: 'String punctuation and prefixes',
    scope: [
      'string punctuation',
      'punctuation.definition.string',
      'storage.type.string',
    ],
    settings: { foreground: t.textPrimary },
  },
  {
    name: 'Comments',
    scope: ['comment', 'comment punctuation'],
    settings: { foreground: t.textMuted },
  },
];

export const semanticTokenColors = {
  '*': t.textPrimary,
  comment: t.textMuted,
  string: t.synString,
  variable: t.synVariable,
  parameter: t.synVariable,
  property: t.textPrimary,
  enumMember: t.synConstant,
  type: t.synKeyword,
  class: t.synKeyword,
  interface: t.synKeyword,
  typeParameter: t.synKeyword,
  function: t.neon,
  method: t.neon,
  number: t.synConstant,
};
