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

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + jwt,
            },
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
    <Box>
      <Helmet>
        <title>{`Overview | Admin Page for Starlight Movie Ticket Sales Website`}</title>
      </Helmet>

      <DashboardContent>
        <Box sx={{ maxWidth: { xs: "100%", md: "1600px" }, margin: "0 auto", px: { xs: 2, md: 0 } }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              mb: { xs: 3, md: 5 }, // Giảm margin-bottom trên mobile
              fontSize: { xs: "2rem", md: "3rem" }, // Giảm font size trên mobile
            }}
          >
            Statistics Overview for This Month
          </Typography>

          {/* Phần thẻ thống kê */}
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            {/* Tổng đơn hàng */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: "#323137",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  minHeight: { xs: "150px", md: "200px" }, // Giảm chiều cao card trên mobile
                }}
              >
                <CardHeader
                  title="Total orders"
                  titleTypographyProps={{ color: "white", fontSize: { xs: "1.4rem", md: "1.8rem" } }}
                />
                <CardContent sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 4 } }}>
                  <Typography variant="h2" sx={{ color: "white", fontSize: { xs: "2.5rem", md: "3rem" } }}>
                    {dashboardData.order ? dashboardData.order : "0"}
                  </Typography>
                  <Typography variant="body" sx={{ color: "rgba(255,255,255,0.7)", fontSize: { xs: "1rem", md: "1.2rem" } }}>
                    orders this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tổng doanh thu */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: "#323137",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  minHeight: { xs: "150px", md: "200px" },
                }}
              >
                <CardHeader
                  title="Revenue"
                  titleTypographyProps={{ color: "white", fontSize: { xs: "1.4rem", md: "1.8rem" } }}
                />
                <CardContent sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 4 } }}>
                  <Typography variant="h2" sx={{ color: "white", fontSize: { xs: "2.5rem", md: "3rem" } }}>
                    {dashboardData.revenue
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(dashboardData.revenue)
                      : 0}
                  </Typography>
                  <Typography variant="body" sx={{ color: "rgba(255,255,255,0.7)", fontSize: { xs: "1rem", md: "1.2rem" } }}>
                    revenue this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Số lượng người dùng mới */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: "#323137",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  minHeight: { xs: "150px", md: "200px" },
                }}
              >
                <CardHeader
                  title="New users"
                  titleTypographyProps={{ color: "white", fontSize: { xs: "1.4rem", md: "1.8rem" } }}
                />
                <CardContent sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 4 } }}>
                  <Typography variant="h2" sx={{ color: "white", fontSize: { xs: "2.5rem", md: "3rem" } }}>
                    {dashboardData.newUser || "0"}
                  </Typography>
                  <Typography variant="body" sx={{ color: "rgba(255,255,255,0.7)", fontSize: { xs: "1rem", md: "1.2rem" } }}>
                    new users this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Doanh thu theo phim */}
          <Box sx={{ mt: { xs: 6, md: 10 } }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                mb: { xs: 3, md: 5 },
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Total tickets and revenue by film
            </Typography>

            <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={12}>
        <TableContainer
          component={Paper}
          sx={{
            background: "#323137",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            overflowX: "auto", // Thêm cuộn ngang trên mobile
          }}
        >
          <Table aria-label="films table">
            <TableHead>
              <TableRow sx={{ height: { xs: 70, md: 80 } }}>
                <TableCell
                  sx={{
                    fontSize: { xs: "1.2rem", md: "1.6rem" },
                    color: "white",
                    py: { xs: 2.5, md: 3 }, // Increased padding for more spacing
                    px: { xs: 4, md: 6 },
                    minWidth: "200px",
                  }}
                >
                  Film name
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: "1.2rem", md: "1.6rem" },
                    color: "white",
                    py: { xs: 2.5, md: 3 }, // Increased padding
                    px: { xs: 4, md: 6 },
                    minWidth: "150px",
                  }}
                  align="center"
                >
                  Number of tickets sold
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: "1.2rem", md: "1.6rem" },
                    color: "white",
                    py: { xs: 2.5, md: 3 }, // Increased padding
                    px: { xs: 4, md: 6 },
                    minWidth: "150px",
                  }}
                  align="center"
                >
                  Revenue
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData.filmResult?.length > 0 ? (
                dashboardData.filmResult.map((film) => (
                  <TableRow
                    key={film.film_id}
                    sx={{
                      height: { xs: 60, md: 70 }, // Increased row height for more spacing
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" }, // Subtle hover effect
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        fontWeight: "bold",
                        color: film.total_tickets_sold ? "white" : "white",
                        py: { xs: 2, md: 2.5 }, // Increased padding for more spacing
                        px: { xs: 4, md: 6 },
                      }}
                    >
                      {film.film_name}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        color: film.total_tickets_sold ? "white" : "white",
                        py: { xs: 2, md: 2.5 }, // Increased padding
                        px: { xs: 4, md: 6 },
                      }}
                    >
                      {film.total_tickets_sold}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        color: film.total_revenue ? "white" : "white",
                        py: { xs: 2, md: 2.5 }, // Increased padding
                        px: { xs: 4, md: 6 },
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
                <TableRow sx={{ height: { xs: 60, md: 70 } }}>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      color: "white",
                      fontSize: { xs: "1rem", md: "1.2rem" },
                      py: { xs: 2.5, md: 3 }, // Increased padding
                    }}
                  >
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