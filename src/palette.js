// Primary configuration for design tokens used by the workbench.
export const paletteConfig = Object.freeze({
  accent: '#3C86FF',
  bgBrightness: 0.075,
  bgSaturation: 0.1,
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

// Adjust HSL lightness/saturation (0–1) and optionally shift hue in degrees.
function adjustHsl(hex, { lightness, saturation, hueShift = 0 }) {
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
  if (hueShift !== 0) hue = ((hue + hueShift / 60) % 6 + 6) % 6;
  const l = clamp(lightness ?? originalLightness);
  const s = clamp(saturation ?? (delta === 0 ? 0 : delta / (1 - Math.abs(2 * originalLightness - 1))));
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(hue % 2 - 1));
  const sectors = [[chroma, x, 0], [x, chroma, 0], [0, chroma, x], [0, x, chroma], [x, 0, chroma], [chroma, 0, x]];
  return toHex(sectors[Math.floor(hue)].map((channel) => (channel + l - chroma / 2) * 255));
}

export function createTokens(overrides = {}) {
  const { accent, bgBrightness, bgSaturation } = { ...paletteConfig, ...overrides };
  if (![bgBrightness, bgSaturation].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new RangeError('Background brightness and saturation must be between 0 and 1');
  }
  const color = toHex(toRgb(accent));

  return Object.freeze({
    // Accent
    accent: color,
    
    // Backgrounds
    bgPrimary:      adjustHsl(color, {lightness: bgBrightness * 1, saturation: bgSaturation * 1}),
    bgSecondary:    adjustHsl(color, {lightness: bgBrightness * 1.25, saturation: bgSaturation * 2}),
    bgTertiary:     adjustHsl(color, {lightness: bgBrightness * 1.5, saturation: bgSaturation * 2.5}),
    bgInteract:     `${color}${byte(clamp(0.1) * 255)}`,
    selectActive:   `${color}4D`,
    selectInactive: `${color}26`,

    // UI
    border:         `${color}${byte(clamp(0.25) * 255)}`,

    // Text
    textPrimary:    mixHex(mixHex(color, '#FFFFFF', 0.3), '#000000', 0.95),
    textSecondary:  mixHex(mixHex(color, '#FFFFFF', 0.4), '#000000', 0.6),
    textMuted:      mixHex(mixHex(color, '#FFFFFF', 0.5), '#000000', 0.5),

    // Syntax
    synAccent:   mixHex(color, '#FFFFFF', 0.55),
    neonBlue:    color,
    neonPurple:  adjustHsl(color, { hueShift: 55, saturation: 0.9, lightness: 0.73 }),
    synConstant: adjustHsl(color, { hueShift: -45, saturation: 0.7, lightness: 0.68 }),
    synString:   adjustHsl(color, { hueShift: -100, saturation: 0.45, lightness: 0.68 }),
  });
}

export const tokens = createTokens();