import { varAlpha } from '../theme/styles';

// ----------------------------------------------------------------------
export const baseVars = (theme) => {
    // console.log("Grey 500:", theme.vars.palette.grey['500Channel']);
    // console.log(varAlpha(theme.vars.palette.grey['500'], 0.08));
    // console.log("Primary Main:", theme.vars.palette.primary.main);

    return {
        // nav
        '--layout-nav-bg': theme.vars.palette.common.white,
        '--layout-nav-border-color': varAlpha(theme.vars.palette.grey['500'], 0.08),
        '--layout-nav-zIndex': 1101,
        '--layout-nav-mobile-width': '320px',
        // nav item
        '--layout-nav-item-height': '44px',
        '--layout-nav-item-color': theme.vars.palette.text.secondary,
        '--layout-nav-item-active-color': theme.vars.palette.primary.main,
        '--layout-nav-item-active-bg': varAlpha(theme.vars.palette.primary.main, 0.08),
        '--layout-nav-item-hover-bg': varAlpha(theme.vars.palette.primary.main, 0.16),
        // header
        // '--layout-header-blur': '8px',
        '--layout-header-zIndex': 1100,
        '--layout-header-mobile-height': '64px',
        '--layout-header-desktop-height': '72px',
    };
};
