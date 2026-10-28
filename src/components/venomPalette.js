const LIGHT_PALETTE = Object.freeze({
  body: [0.008, 0.008, 0.01],
  shadow: [0.025, 0.03, 0.027],
  reflection: [0.74, 0.78, 0.76],
  fallback: 'linear-gradient(180deg, #242825 0%, #101311 48%, #050706 100%)',
  shadowCss: '0 12px 22px -13px rgba(0, 0, 0, .72), inset 0 1px 0 rgba(255, 255, 255, .14), inset 0 -1px 0 rgba(255, 255, 255, .16)',
  label: '#f5f6f3',
});

const DARK_PALETTE = Object.freeze({
  body: [0.97, 0.98, 0.96],
  shadow: [0.38, 0.41, 0.39],
  reflection: [0.98, 1, 0.98],
  fallback: 'linear-gradient(180deg, #ffffff 0%, #f5f7f4 48%, #dfe5df 100%)',
  shadowCss: '0 12px 22px -13px rgba(0, 0, 0, .3), inset 0 1px 0 rgba(255, 255, 255, .9), inset 0 -1px 0 rgba(114, 125, 116, .5)',
  label: '#111411',
});

export function getVenomPalette(theme) {
  return theme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;
}
