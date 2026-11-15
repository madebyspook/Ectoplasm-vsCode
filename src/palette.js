// Shared colors for the workbench, syntax highlighting, and optional glow.
export const palette = {
  electric: '#3C86FF',
  electricLight: '#94bdff',
  cosmic: '#4545D9',
  ice: '#00D9F5',
  plasma: '#F044C8',
  neon: '#C5DAFF',
  bgPrimary: '#15171c',
  bgSecondary: '#171b24',
  bgTertiary: '#1c222e',
  bgInteract: '#202b40',
  bgInteractInactive: '#202b4026',
  border: '#243659',
  buttonBorder: '#243659',
  textPrimary: '#BBD0F2',
  textSecondary: '#6A7C99',
  textMuted: '#4F6180',
};

export const tokens = {
  // Syntax
  synVariable:  palette.electricLight,
  synKeyword:   palette.cosmic,
  synConstant:  palette.plasma,
  synString:    palette.ice,

  // Source control decorations
  scmModified:  palette.electric,
  scmUntracked: palette.cosmic,
  scmRemoved:   palette.plasma,
};

// Scale RGB channels toward black for glow outlines and muted halos.
function darken(hex, strength) {
  return '#' + hex.slice(1).match(/../g)
    .map((channel) => Math.round(parseInt(channel, 16) * strength).toString(16).padStart(2, '0'))
    .join('').toUpperCase();
}

export function createGlowColors() {
  return {
    synGlow: {
      foreground: palette.neon,
      outline: darken(palette.electric, 0.09),
      halo: palette.electric,
    },
    synKeyword: {
      foreground: tokens.synKeyword,
      outline: darken(tokens.synKeyword, 0.06),
      halo: darken(tokens.synKeyword, 0.8),
    },
    synConstant: {
      foreground: tokens.synConstant,
      outline: darken(tokens.synConstant, 0.22),
      halo: tokens.synConstant,
    },
    synVariable: {
      foreground: tokens.synVariable,
      outline: '#000000',
      halo: tokens.synVariable.toUpperCase(),
    },
  };
}
