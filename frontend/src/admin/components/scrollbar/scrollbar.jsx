import { forwardRef } from 'react';
import SimpleBar from 'simplebar-react';

import Box from '@mui/material/Box';

import { scrollbarClasses } from './classes';

/**
 * Scrollbar - A wrapper component that utilizes `simplebar-react` to provide a custom scrollable area
 * with customizable styling and behavior.
 * This component is used to add a scrollbar to content with a highly customizable design and layout.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the scrollable area.
 * @param {boolean} [props.fillContent=false] - If true, it ensures the content inside the scrollbar fills the available space.
 * @param {Object} [props.slotProps] - Optional custom props for customizing parts of the scrollbar. It includes:
 *  - `wrapper`: Custom styles for the outer wrapper of the scrollbar.
 *  - `contentWrapper`: Custom styles for the content wrapper inside the scrollbar.
 *  - `content`: Custom styles for the content area.
 * @param {Object} [props.sx] - Custom styles to be applied using MUI's `sx` prop for additional styling.
 * @param {Object} [props.other] - Any additional props passed to the `SimpleBar` component from `simplebar-react`.
 * @param {React.Ref} ref - A reference passed to the underlying `SimpleBar` component, useful for DOM access.
 *
 * @returns {JSX.Element} The rendered scrollable component with custom styling and content.
 * 
 * @example
 * <Scrollbar fillContent={true}>
 *     <div>Some content that will be scrollable.</div>
 * </Scrollbar>
 */

export const Scrollbar = forwardRef(function Scrollbar(
    { slotProps, children, fillContent, sx, ...other },
    ref
) {
    return (
        <Box
            component={SimpleBar}
            scrollableNodeProps={{ ref }}
            clickOnTrack={false}
            className={scrollbarClasses.root}
            sx={{
                minWidth: 0,
                minHeight: 0,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                '& .simplebar-wrapper': slotProps?.wrapper,
                '& .simplebar-content-wrapper': slotProps?.contentWrapper,
                '& .simplebar-content': {
                    ...(fillContent && {
                        minHeight: 1,
                        display: 'flex',
                        flex: '1 1 auto',
                        flexDirection: 'column',
                    }),
                    ...slotProps?.content,
                },
                ...sx,
            }}
            {...other}
        >
            {children}
        </Box>
    );
});
