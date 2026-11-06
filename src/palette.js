// Primary configuration for design tokens; VS Code mappings remain unchanged below.
export const paletteConfig = Object.freeze({
  accent: '#3C86FF',
  bgBrightness: 0.2,
  bgSaturation: 0.008,
});

const clamp = (value) => Math.min(1, Math.max(0, value));
const byte = (value) => Math.round(value).toString(16).padStart(2, '0').toUpperCase();
const toHex = (channels) => `#${channels.map(byte).join('')}`;

function toRgb(hex) {
  if (typeof hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(hex)) {
    throw new TypeError('Expected a #RRGGBB color');
  }
  return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
}

// Weight belongs to the first color. Each hex result is rounded to RGB bytes.
function mixHex(first, second, weight) {
  const other = toRgb(second);
  return toHex(toRgb(first).map((channel, i) => channel * weight + other[i] * (1 - weight)));
}

// Set either HSL lightness or saturation (0–1), preserving the accent hue.
function adjustHsl(hex, { lightness, saturation }) {
  const [r, g, b] = toRgb(hex).map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const originalLightness = (max + min) / 2;
  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta + 6) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }
  const l = clamp(lightness ?? originalLightness);
  const s = clamp(saturation ?? (delta === 0 ? 0 : delta / (1 - Math.abs(2 * originalLightness - 1))));
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(hue % 2 - 1));
  const sectors = [[chroma, x, 0], [x, chroma, 0], [0, chroma, x], [0, x, chroma], [x, 0, chroma], [chroma, 0, x]];
  return toHex(sectors[Math.floor(hue)].map((channel) => (channel + l - chroma / 2) * 255));
}

function withAlpha(hex, alpha) {
  return `${hex}${byte(clamp(alpha) * 255)}`;
}

export function createDesignTokens(overrides = {}) {
  const { accent, bgBrightness, bgSaturation } = { ...paletteConfig, ...overrides };
  if (![bgBrightness, bgSaturation].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new RangeError('Background brightness and saturation must be between 0 and 1');
  }
  const color = toHex(toRgb(accent));
  const surface = (brightnessScale, saturationScale) => adjustHsl(color, {
    lightness: bgBrightness * brightnessScale,
    saturation: bgSaturation * saturationScale,
  });
  const text = (accentWeight, intermediateWeight) =>
    mixHex(mixHex(color, '#FFFFFF', accentWeight), '#000000', intermediateWeight);

  return Object.freeze({
    accent: color,
    bgPrimary: surface(1, 1),
    bgSecondary: surface(1.1, 1.75),
    bgTertiary: surface(1.3, 2.5),
    bgInteract: withAlpha(color, 0.1),
    border: withAlpha(color, 0.25),
    textNeon: text(0.15, 0.95),
    textPrimary: text(0.3, 0.95),
    textSecondary: text(0.4, 0.6),
    textMuted: text(0.5, 0.5),
  });
}

export const designTokens = createDesignTokens();

// Existing foundation colors; final Ectoplasm palette mapping is a later phase.
export const palette = {
  editorBackground: '#1F1F1F',
  editorForeground: '#D4D4D4',
  panelBackground: '#181818',
  primaryForeground: '#CCCCCC',
  panelBorder: '#2B2B2B',
  activeForeground: '#FFFFFF',
  mutedForeground: '#9D9D9D',
  inputBackground: '#313131',
  widgetBackground: '#202020',
  quickInputBackground: '#222222',
  accent: '#0078D4',
  link: '#4DAAFC',
  comment: '#6A9955',
  keyword: '#569CD6',
  string: '#CE9178',
  constant: '#B5CEA8',
  function: '#DCDCAA',
  type: '#4EC9B0',
  variable: '#9CDCFE',
  invalid: '#F44747',
};
