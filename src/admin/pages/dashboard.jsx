import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from '../layouts/dashboard';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody } from '@mui/material';

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        order: 0,
        revenue: 0,
        newUser: 0,
        filmResult: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const jwt = localStorage.getItem('jwt');

            if (!jwt) {
                console.error('JWT token is missing');
                return;
            }

            // console.log(jwt);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + jwt,
                    },
                    // credentials: 'include',
                });

                const result = await response.json();
                setDashboardData(result);
                console.log(result);
            } catch (error) {
                // console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Box
        // sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: 3 }}
        >
            <Helmet>
                <title>{`Tổng quan | Trang quản trị website bán vé xem phim NHTT`}</title>
            </Helmet>

            <DashboardContent>
                <Box>
                    <Typography variant="h2" gutterBottom>
                        Tổng quan thống kê tháng này
                    </Typography>

                    {/* Phần thẻ thống kê */}
                    <Grid container spacing={3}>

                        {/* Tổng đơn hàng */}
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardHeader title="Tổng Đơn Hàng" />
                                <CardContent>
                                    <Typography variant="h3">
                                        {dashboardData.order ? dashboardData.order : '0'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        đơn hàng trong tháng này
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Tổng doanh thu */}
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardHeader title="Doanh Thu" />
                                <CardContent>
                                    <Typography variant="h3">
                                        {dashboardData.revenue ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dashboardData.revenue) : 0}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        doanh thu trong tháng này
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Số lượng người dùng mới */}
                        <Grid item xs={12} sm={4}>
                            <Card>
                                <CardHeader title="Người Dùng Mới" />
                                <CardContent>
                                    <Typography variant="h3">
                                        {dashboardData.newUser || '0'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        người dùng mới trong tháng này
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Doanh thu theo phim */}
                    <Box sx={{ mt: 10 }}>

                        <Typography variant="h2" gutterBottom>
                            Tổng vé và doanh thu theo phim
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table aria-label="films table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tên phim</TableCell>
                                                <TableCell align="center">Số vé đã bán</TableCell>
                                                <TableCell align="center">Doanh thu</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.filmResult?.length > 0 ? (
                                                dashboardData.filmResult.map((film) => (
                                                    <TableRow key={film.film_id}>

                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            sx={{
                                                                fontWeight: "bold",
                                                                color: film.total_tickets_sold ? 'inherit' : 'red'
                                                            }}
                                                        >
                                                            {film.film_name}
                                                        </TableCell>

                                                        <TableCell
                                                            align="center"
                                                            sx={{ color: film.total_tickets_sold ? 'inherit' : 'red' }}
                                                        >
                                                            {film.total_tickets_sold}
                                                        </TableCell>

                                                        <TableCell
                                                            align="center"
                                                            sx={{ color: film.total_revenue ? 'inherit' : 'red' }}
                                                        >
                                                            {film.total_revenue
                                                                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(film.total_revenue)
                                                                : 'Chưa có doanh thu'}
                                                        </TableCell>

                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        Không có dữ liệu phim.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>
            </DashboardContent>
        </Box>
    );
}
