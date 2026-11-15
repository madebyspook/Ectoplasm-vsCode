import { palette as p, tokens as t } from './palette.js';

export const tokenColors = [
  {
    name: 'General code',
    scope: ['source', 'meta.embedded', 'meta.template.expression', 'meta.fstring'],
    settings: { foreground: p.textPrimary },
  },
  {
    name: 'Operators and separators',
    scope: [
      'keyword.operator',
      'punctuation.terminator',
      'punctuation.separator',
    ],
    settings: { foreground: p.textSecondary },
  },
  {
    name: 'Parameters',
    scope: ['variable.parameter'],
    settings: { foreground: t.synVariable },
  },
  {
    name: 'SCSS Color Syntax',
    scope: ['variable.parameter.url.scss'],
    settings: { foreground: t.synKeyword },
  },
  {
    name: 'Variables',
    scope: [
      'variable.other.readwrite',
      'variable.other.local',
      'variable.scss',
      'variable.sass',
      'variable.other.scss',
      'variable.other.sass',
    ],
    settings: { foreground: t.synVariable },
  },
  {
    name: 'SCSS color function keywords',
    scope: [
      'support.function.color.scss',
      'support.function.color.sass',
    ],
    settings: { foreground: t.synKeyword },
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
    settings: { foreground: p.neon },
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
      'storage.type.string',
    ],
    settings: { foreground: p.textPrimary },
  },
  {
    name: 'String quotes',
    scope: ['punctuation.definition.string'],
    settings: { foreground: t.synString },
  },
  {
    name: 'Comments',
    scope: ['comment', 'comment punctuation'],
    settings: { foreground: p.textMuted },
  },
];

export const semanticTokenColors = {
  '*': p.textPrimary,
  comment: p.textMuted,
  string: t.synString,
  variable: t.synVariable,
  parameter: t.synVariable,
  property: p.textPrimary,
  enumMember: t.synConstant,
  type: t.synKeyword,
  class: t.synKeyword,
  interface: t.synKeyword,
  typeParameter: t.synKeyword,
  function: p.neon,
  method: p.neon,
  number: t.synConstant,
};
