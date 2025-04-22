import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { StyledLabel } from './styles';
import { labelClasses } from './classes';

/**
 * Label - A customizable label component that allows adding icons, color variants, and text styling.
 * This component is designed for flexibility and can render text with optional icons, providing an easy
 * way to display labels with a variety of styles.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the label, typically text.
 * @param {string} [props.color='default'] - The color variant of the label. Can be customized.
 * @param {string} [props.variant='soft'] - The variant of the label, determines the label's visual style.
 * @param {React.ReactNode} [props.startIcon] - An optional icon to be displayed at the start of the label.
 * @param {React.ReactNode} [props.endIcon] - An optional icon to be displayed at the end of the label.
 * @param {Object} [props.sx] - Custom styles to be applied using MUI's `sx` prop.
 * @param {string} [props.className] - Additional CSS class names to apply to the label component.
 * @param {Object} [props.other] - Any additional props passed to the `StyledLabel` component.
 * @param {React.Ref} ref - A reference passed to the underlying `StyledLabel` component, useful for DOM access.
 *
 * @returns {JSX.Element} The rendered label element with optional icons and styled text.
 * 
 * @example
 * <Label color="primary" variant="outlined" startIcon={<SearchIcon />} endIcon={<ArrowForwardIcon />}>
 *     Click here
 * </Label>
 * 
 * @see StyledLabel for the component's custom styling.
 */
export const Label = forwardRef(({
    children,
    color = 'default',
    variant = 'soft',
    startIcon,
    endIcon,
    sx,
    className,
    ...other
}, ref) => {
    const theme = useTheme();

    // Styles for icons
    const iconStyles = {
        width: 16,
        height: 16,
        '& svg, img': {
            width: 1,
            height: 1,
            objectFit: 'cover',
        },
    };

    return (
        <StyledLabel
            ref={ref}
            component="span"
            className={labelClasses.root.concat(className ? ` ${className}` : '')}
            ownerState={{ color, variant }}
            sx={{ ...(startIcon && { pl: 0.75 }), ...(endIcon && { pr: 0.75 }), ...sx }}
            theme={theme}
            {...other}
        >
            {startIcon && (
                <Box component="span" className={labelClasses.icon} sx={{ mr: 0.75, ...iconStyles }}>
                    {startIcon}
                </Box>
            )}

            {typeof children === 'string' ? sentenceCase(children) : children}

            {endIcon && (
                <Box component="span" className={labelClasses.icon} sx={{ ml: 0.75, ...iconStyles }}>
                    {endIcon}
                </Box>
            )}
        </StyledLabel>
    );
});

// ----------------------------------------------------------------------

// Helper function to convert string to sentence case
function sentenceCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
