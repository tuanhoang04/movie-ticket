import { Alert, Box, Button, CircularProgress, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Iconify } from "../../../components/iconify";
import { DashboardContent } from "../../../layouts/dashboard";

export function NewsView() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        async function fetchAdminNews() {
            try {
                const jwt = localStorage.getItem('jwt');

                if (!jwt) {
                    console.error('JWT token is missing');
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/news`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + jwt,
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error; ${response.statusText}`);
                }

                // const data = await response.json();
                setNews(data);
            } catch (err) {
                setError(err.message);
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        }
        fetchAdminNews();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );

    return (
        <DashboardContent>
            <Box
                display='flex'
                mb={5}
                sx={{
                    width: "100%",
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        flexGrow: 1,
                        marginBottom: { xs: 1 },
                    }}
                >
                    Quản lý tin tức
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    Thêm bài viết
                </Button>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </DashboardContent>

    )
}
