// import COLORS from './colors.json';
// import { varAlpha, createPaletteChannel } from '../styles';

// // Color Types
// export const colorTypes = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

// // Grey
// export const grey = createPaletteChannel(COLORS.grey);

// // Primary
// export const primary = createPaletteChannel(COLORS.primary);

// // Secondary
// export const secondary = createPaletteChannel(COLORS.secondary);

// // Info
// export const info = createPaletteChannel(COLORS.info);

// // Success
// export const success = createPaletteChannel(COLORS.success);

// // Warning
// export const warning = createPaletteChannel(COLORS.warning);

// // Error
// export const error = createPaletteChannel(COLORS.error);

// // Common
// export const common = createPaletteChannel(COLORS.common);

// // Text
// export const text = {
//     light: createPaletteChannel({
//         primary: grey[800],
//         secondary: grey[600],
//         disabled: grey[500],
//     }),
//     dark: createPaletteChannel({
//         primary: grey[500],
//         secondary: grey[600],
//         disabled: grey[800],
//     }),

// };

// // Background
// export const background = {
//     light: createPaletteChannel({
//         paper: common["white"],
//         default: grey[100],
//         neutral: grey[200],
//     }),
//     dark: createPaletteChannel({
//         paper: grey[900],
//         default: grey[800],
//         neutral: grey[700],
//     }),
// };

// // Action
// const baseAction = {
//     hover: varAlpha(grey['500Channel'], 0.08),
//     selected: varAlpha(grey['500Channel'], 0.16),
//     focus: varAlpha(grey['500Channel'], 0.24),
//     disabled: varAlpha(grey['500Channel'], 0.8),
//     disabledBackground: varAlpha(grey['500Channel'], 0.24),
//     hoverOpacity: 0.08,
//     disabledOpacity: 0.48,
// };

// export const action = {
//     light: { ...baseAction, active: grey[600] },
//     dark: { ...baseAction, active: grey[300] },
// };

// // Base pallete
// const basePalette = {
//     primary,
//     secondary,
//     info,
//     success,
//     warning,
//     error,
//     grey,
//     common,
//     divider: varAlpha(grey['500Channel'], 0.2),
//     action,
// };

// export const lightPalette = {
//     ...basePalette,
//     text: text.light,
//     background: background.light,
//     action: action.light,
// };


// export const darkPallete = {
//     ...basePalette,
//     text: text.dark,
//     background: background.dark,
//     action: action.dark,
// }

// export const colorSchemes = {
//     light: { palette: lightPalette },
//     dark: { palette: darkPallete },
// };
