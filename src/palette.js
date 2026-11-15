// Primary configuration for design tokens used by the workbench.
const paletteConfig = {
  electric: '#3C86FF',
  cosmic: '#4545D9',
  ice: '#00D9F5',
  plasma: '#F044C8',
  neon: '#C5DAFF',
  bgBrightness: 0.075,
  bgSaturation: 0.1,
};

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
  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta + 6) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }
  if (hueShift !== 0) hue = ((hue + hueShift / 60) % 6 + 6) % 6;
  const l = clamp(lightness);
  const s = clamp(saturation);
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(hue % 2 - 1));
  const sectors = [[chroma, x, 0], [x, chroma, 0], [0, chroma, x], [0, x, chroma], [x, 0, chroma], [chroma, 0, x]];
  return toHex(sectors[Math.floor(hue)].map((channel) => (channel + l - chroma / 2) * 255));
}

const { electric, cosmic, ice, plasma, bgBrightness, bgSaturation } = paletteConfig;
if (![bgBrightness, bgSaturation].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
  throw new RangeError('Background brightness and saturation must be between 0 and 1');
}
const color = toHex(toRgb(electric));
const bgTertiary = adjustHsl(color, { lightness: bgBrightness * 1.5, saturation: bgSaturation * 2.5 });

export const tokens = {
  // electric
  electric: color,
  neon: adjustHsl(color, { saturation: 1, lightness: 0.94 }),

  // Backgrounds
  bgPrimary:      '#15171c',
  bgSecondary:    '#171b24',
  bgTertiary:     '#1c222e',
  bgInteract:     '#202b40',
  selectActive:   `${color}4D`,
  selectInactive: `${color}26`,

  // UI
  border:         '#243659',

  // Buttons
  buttonHover: mixHex(color, '#FFFFFF', 0.85),
  buttonBorder: '#243659',
  buttonSecondaryBorder: adjustHsl(color, { saturation: 0, lightness: bgBrightness + 0.2 }),
  buttonSecondaryHover: mixHex(color, bgTertiary, 0.2),

  // Text
  textPrimary:    '#BBD0F2',
  textSecondary:  '#6A7C99',
  textMuted:      '#4F6180',

  // Syntax
  synVariable: mixHex(color, '#FFFFFF', 0.5),
  synKeyword:   cosmic,
  synConstant:  plasma,
  synString:    ice,

  // Source control decorations
  scmModified: color,
  scmUntracked: adjustHsl(color, { hueShift: 15, saturation: 0.9, lightness: 0.655 }),
};

// Shadow hues follow the syntax palette; weights approximate SynthWave's dark
// outlines and muted green/pink halos without importing its foreground colors.
export function createGlowColors() {
  const glow = (name, outline, halo = 1, glowColor = name) => ({
    foreground: tokens[name],
    outline: mixHex(tokens[glowColor], '#000000', outline),
    halo: mixHex(tokens[glowColor], '#000000', halo),
  });
  return {
    synGlow: glow('neon', 0.09, 1, 'electric'),
    synKeyword: glow('synKeyword', 0.06, 0.8),
    synConstant: glow('synConstant', 0.22),
    synVariable: glow('synVariable', 0),
  };
}
