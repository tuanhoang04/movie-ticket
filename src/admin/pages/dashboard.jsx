import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { DashboardContent } from "../layouts/dashboard";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@mui/material";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    order: 0,
    revenue: 0,
    newUser: 0,
    filmResult: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        console.error("JWT token is missing");
        return;
      }

      // console.log(jwt);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + jwt,
            },
            // credentials: 'include',
          }
        );

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
        <title>{`Overview | Admin Page for Starlight Movie Ticket Sales Website`}</title>
      </Helmet>

      <DashboardContent>
        <Box>
          <Typography variant="h2" gutterBottom>
            Statistics Overview for This Month
          </Typography>

          {/* Phần thẻ thống kê */}
          <Grid container spacing={3}>
            {/* Tổng đơn hàng */}
            <Grid item xs={10} sm={4}>
              <Card>
                <CardHeader title="Total orders" />
                <CardContent>
                  <Typography variant="h2">
                    {dashboardData.order ? dashboardData.order : "0"}
                  </Typography>
                  <Typography variant="body" color="textSecondary">
                    orders this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tổng doanh thu */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title="Revenue" />
                <CardContent>
                  <Typography variant="h2">
                    {dashboardData.revenue
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(dashboardData.revenue)
                      : 0}
                  </Typography>
                  <Typography variant="body" color="textSecondary">
                    revenue this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Số lượng người dùng mới */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title="New users" />
                <CardContent>
                  <Typography variant="h2">
                    {dashboardData.newUser || "0"}
                  </Typography>
                  <Typography variant="body" color="text.secondary">
                    new users this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Doanh thu theo phim */}
          <Box sx={{ mt: 10 }}>
            <Typography variant="h2" gutterBottom>
              Total tickets and revenue by film
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table aria-label="films table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: "1.5rem" }}>
                          Film name
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.5rem" }} align="center">
                          Number of tickets sold
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.5rem" }} align="center">
                          Revenue
                        </TableCell>
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
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                color: film.total_tickets_sold
                                  ? "inherit"
                                  : "red",
                              }}
                            >
                              {film.film_name}
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                fontSize: "1.2rem",

                                color: film.total_tickets_sold
                                  ? "inherit"
                                  : "red",
                              }}
                            >
                              {film.total_tickets_sold}
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                fontSize: "1.2rem",

                                color: film.total_revenue ? "inherit" : "red",
                              }}
                            >
                              {film.total_revenue
                                ? new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(film.total_revenue)
                                : "No revenue yet"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No film data available.
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
