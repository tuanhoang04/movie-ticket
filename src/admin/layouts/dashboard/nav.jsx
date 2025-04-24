import { useEffect } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { usePathname } from '../../routes/hooks';
import { Link } from 'react-router-dom';
import { varAlpha } from '../../theme/styles';
import { Scrollbar } from '../../components/scrollbar';
import Typography from '@mui/material/Typography';

export function NavContent({ data, slots, sx }) {
    const pathname = usePathname();

    const handleLogout = (path) => {
        if (path === '/home') {
            window.location.href = '/home';
        }
    }

    return (
        <>
            {/* Logo and Title */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: 3, // Tăng padding để tạo khoảng cách
                mb: 2, // Thêm margin bottom để tạo khoảng cách với menu
                gap: 1.5
            }}>
                <Box component="div" sx={{ 
                    backgroundColor: 'white', 
                    borderRadius: '50%', 
                    width: 36, 
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)' // Thêm shadow cho logo
                }}>
                    <Box component="span" sx={{ color: '#502A50', fontSize: 20 }}>⬢</Box>
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Starlight Cinema
                </Typography>
            </Box>

            <Scrollbar>
                <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={{
                    px: 1.5, // Thêm padding ngang để tạo khoảng cách 2 lề rộng hơn
                    ...sx
                }}>
                    <Box component="ul" sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}> {/* Sửa lỗi cú pháp cho gap */}
                        {data.filter(item => item.path !== '/auth').map((item) => { // Lọc bỏ "Return to Homepage"
                            const isActived = item.path === pathname;

                            return (
                                <ListItem disableGutters disablePadding key={item.title}>
                                    <ListItemButton
                                        disableGutters
                                        component={Link}
                                        to={item.path}
                                        onClick={() => handleLogout(item.path)}
                                        sx={{
                                            pl: 2,
                                            py: 1.5,
                                            gap: 2,
                                            pr: 1.5,
                                            borderRadius: 1.5, // Thêm border radius cho các menu item
                                            typography: 'body2',
                                            fontWeight: 'fontWeightMedium',
                                            color: 'rgba(255, 255, 255, 0.85)', // Tăng độ sáng của chữ
                                            minHeight: 42,
                                            ...(isActived && {
                                                fontWeight: 'fontWeightSemiBold',
                                                bgcolor: 'rgba(255, 255, 255, 0.1)', // Làm nhẹ hơn background của item active
                                                color: 'white',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)', // Thêm shadow cho item active
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                                },
                                            }),
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                            },
                                        }}
                                    >
                                        <Box component="span" sx={{ 
                                            width: 24, 
                                            height: 24, 
                                            color: 'rgba(255, 255, 255, 0.85)',
                                            ...(isActived && {
                                                color: 'white',
                                            }),
                                        }}>
                                            {item.icon}
                                        </Box>

                                        <Box component="span" flexGrow={1} sx={{ 
                                            fontSize: '0.9rem' // Giảm font size để tạo thêm khoảng trống 
                                        }}>
                                            {item.title}
                                        </Box>

                                        {item.path !== '/admin/dashboard' && (
                                            <Box component="span" sx={{ 
                                                color: isActived ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                                                fontSize: '0.8rem' // Giảm kích thước mũi tên
                                            }}>
                                                &gt;
                                            </Box>
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </Box>
                </Box>
            </Scrollbar>

            {/* User greeting card - Di chuyển lên cao hơn bằng cách thêm marginTop âm */}
            <Box sx={{ 
                mx: 3,
                mb: 3,
                mt: -2, // Thêm margin top âm để đẩy khung lên trên
                p: 2.5, 
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.2) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'medium' }}>
                    Hi, Imhiong 👋
                </Typography>
                
                <Box 
                    component="button"
                    onClick={() => window.location.href = '/home'}
                    sx={{
                        mt: 2.5, // Tăng margin-top từ 1.5 lên 2.5 để tạo khoảng cách lớn hơn với dòng "Hi, Imhiong"
                        display: 'inline-flex',
                        py: 1,
                        px: 2,
                        color: 'white',
                        bgcolor: 'rgba(0,0,0,0.3)',
                        border: 'none',
                        borderRadius: 50,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 'medium',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textDecoration: 'none',
                        width: 'fit-content',
                        '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.4)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        }
                    }}
                >
                    Return to Homepage
                </Box>
            </Box>
        </>
    );
}

export function NavDesktop({ sx, data, slots, layoutQuery }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                pt: 0,
                px: 0,
                top: 0,
                left: 0,
                height: 1,
                display: 'none',
                position: 'fixed',
                flexDirection: 'column',
                bgcolor: '#502A50', // Thay đổi màu nền
                zIndex: 'var(--layout-nav-zIndex)',
                width: 'var(--layout-nav-vertical-width)',
                boxShadow: '0 0 30px rgba(0,0,0,0.25)', // Tăng shadow cho sidebar
                [theme.breakpoints.up(layoutQuery)]: {
                    display: 'flex',
                },
                ...sx,
            }}
        >
            <NavContent data={data} slots={slots} />
        </Box>
    );
}

export function NavMobile({ sx, data, open, slots, onClose }) {
    const pathname = usePathname();

    useEffect(() => {
        if (open) {
            onClose(); // Closes the drawer when the pathname changes
        }
    }, [pathname]); // Effect runs on pathname change

    return (
        <Drawer
            open={open}
            onClose={onClose}
            sx={{
                [`& .${drawerClasses.paper}`]: {
                    pt: 0,
                    px: 0,
                    overflow: 'unset',
                    bgcolor: '#502A50', // Thay đổi màu nền
                    width: 'var(--layout-nav-mobile-width)',
                    boxShadow: '0 0 30px rgba(0,0,0,0.25)', // Tăng shadow
                    ...sx,
                },
            }}
        >
            <NavContent data={data} slots={slots} />
        </Drawer>
    );
}