import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { layoutClasses } from '../classes';

// ----------------------------------------------------------------------

export function HeaderSection({
    sx,
    slots,
    slotProps,
    layoutQuery = 'md',
    ...other
}) {
    const theme = useTheme();

    // styles mặc định cho thành phần toolbar
    const toolbarStyles = {
        default: {
            minHeight: 'auto',
            height: 'var(--layout-header-mobile-height)',
            transition: theme.transitions.create(['height', 'background-color'], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
            }),
            [theme.breakpoints.up('sm')]: {
                minHeight: 'auto',
            },
            [theme.breakpoints.up(layoutQuery)]: {
                height: 'var(--layout-header-desktop-height)',
            },
        },
    };

    return (
        <AppBar
            position="sticky"
            color="transparent"
            className={layoutClasses.header}
            sx={{
                boxShadow: 'none',
                zIndex: 'var(--layout-header-zIndex)',
                ...sx,
            }}
            {...other}
        >
            {slots?.topArea}

            <Toolbar
                disableGutters
                {...slotProps?.toolbar}
                sx={{
                    ...toolbarStyles.default,
                    ...slotProps?.toolbar?.sx,
                }}
            >
                <Container
                    {...slotProps?.container}
                    sx={{
                        height: 1,
                        display: 'flex',
                        alignItems: 'center',
                        ...slotProps?.container?.sx,
                    }}
                >
                    {slots?.leftArea}

                    <Box sx={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center' }}>
                        {slots?.centerArea}
                    </Box>

                    {slots?.rightArea}
                </Container>
            </Toolbar>

            {slots?.bottomArea}
        </AppBar>
    );
}
