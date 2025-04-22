import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { colorSchemes, typography, shadows, components } from './core';

// Create a theme instance.
const theme = extendTheme({
    colorSchemes,
    typography,
    shadows: shadows(),
    components,
    shape: { borderRadius: 8 },
    cssVarPrefix: '',
    shouldSkipGeneratingVar
},
);

function shouldSkipGeneratingVar(keys, value) {
    const skipGlobalKeys = [
        'mixins',
        'overlays',
        'direction',
        'typography',
        'breakpoints',
        'transitions',
        'cssVarPrefix',
        'unstable_sxConfig',
    ];

    const skipPaletteKeys = {
        global: ['tonalOffset', 'dividerChannel', 'contrastThreshold'],
        grey: ['A100', 'A200', 'A400', 'A700'],
        text: ['icon'],
    };

    const isPaletteKey = keys[0] === 'palette';

    if (isPaletteKey) {
        const paletteType = keys[1];
        const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;

        return keys.some((key) => skipKeys.includes(key));
    }

    return keys.some((key) => skipGlobalKeys.includes(key));
}


export default theme;