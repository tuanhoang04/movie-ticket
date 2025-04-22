import { forwardRef } from 'react';
import { Icon, disableCache } from '@iconify/react';

import Box from '@mui/material/Box';

import { iconifyClasses } from './classes';

/**
 * Iconify - A reusable wrapper component for rendering icons using Iconify.
 * This component leverages the MUI `Box` component and `@iconify/react`'s `Icon` 
 * to provide a flexible and styled icon component that integrates seamlessly with MUI styling.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.className - Additional CSS class names to apply to the icon.
 * @param {number} [props.width=20] - The width and height of the icon. Defaults to 20.
 * @param {Object} [props.sx] - Custom styles to apply using MUI's `sx` prop.
 * @param {Object} [props.other] - Additional properties passed to the `Icon` component.
 * @param {React.Ref} ref - A reference passed to the underlying component, useful for DOM access.
 *
 * @returns {JSX.Element} A styled `Box` component with an embedded `Icon` component, 
 *                        representing the rendered icon.
 *
 * @example
 * <Iconify icon="eva:search-fill" width={24} sx={{ color: 'primary.main' }} />
 * 
 * @see https://iconify.design/docs/iconify-icon/disable-cache.html for disabling icon cache.
 */

export const Iconify = forwardRef(function Iconify(
    { className, width = 20, sx, ...other },
    ref
) {
    return (
        <Box
            ssr
            ref={ref}
            component={Icon}
            className={`${iconifyClasses.root}${className ? ` ${className}` : ''}`}
            sx={{
                width,
                height: width,
                flexShrink: 0,
                display: 'inline-flex',
                ...sx,
            }}
            {...other}
        />
    );
})

disableCache('local');
