import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
import { formatCurrency } from "../../utils";

export function OrderDetailsView({ orderId }) {
  const [orderData, setOrderData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          throw new Error("JWT token is missing");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/orders/detail/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Error: " + err.message,
          severity: "error",
        });
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  if (!orderData && !snackbar.open) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#323137",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#FFFFFF", fontSize: { xs: "1.1rem", md: "1.2rem" } }}
        >
          Loading data...
        </Typography>
      </Box>
    );
  }

  const { Ticket_Seat_Room, popcorn, order } = orderData || {};

  return (
    <Box sx={{ p: 4, bgcolor: "#323137" }}>
      {/* Thông tin đơn hàng */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{ color: "#FFFFFF", fontWeight: "bold" }}
      >
        Order Detail
      </Typography>
      {order && order[0] ? (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            sx={{ color: "#FFFFFF", fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            <strong>Order ID:</strong> {order[0].order_id}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#FFFFFF", fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            <strong>Booker:</strong> {order[0].username}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#FFFFFF", fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            <strong>Film:</strong> {order[0].film_name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#FFFFFF", fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            <strong>Show date:</strong>{" "}
            {new Date(order[0].show_date).toLocaleDateString()}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#FFFFFF", fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            <strong>Total Price:</strong> {formatCurrency(order[0].total_price)}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#FFFFFF", fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            <strong>Booking Date:</strong>{" "}
            {new Date(order[0].order_date).toLocaleDateString()}
          </Typography>
        </Box>
      ) : null}

      {/* Chi tiết đơn hàng */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{ color: "#FFFFFF", fontWeight: "bold" }}
      >
        Ticket Details
      </Typography>
      <TableContainer
        sx={{
          bgcolor: "#323137",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          mb: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <strong>Cinema</strong>
              </TableCell>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <strong>Room</strong>
              </TableCell>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <strong>Seat Row</strong>
              </TableCell>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <strong>Seat</strong>
              </TableCell>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <strong>Ticket price</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Ticket_Seat_Room && Ticket_Seat_Room.length > 0 ? (
              Ticket_Seat_Room.map((ticket, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { bgcolor: "#4A494E" },
                    borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <TableCell
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {ticket.cinema_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {ticket.room_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {ticket.seat_row}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {ticket.seat_number}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {formatCurrency(ticket.ticket_price)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    color: "#FFFFFF",
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    textAlign: "center",
                    borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  No ticket details available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Chi tiết gọi kèm */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{ color: "#FFFFFF", fontWeight: "bold" }}
      >
        Snack & Drink Information
      </Typography>
      <TableContainer
        sx={{
          bgcolor: "#323137",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <strong>Combo</strong>
              </TableCell>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <strong>Price</strong>
              </TableCell>
              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <strong>Quantity</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {popcorn && popcorn.length > 0 ? (
              popcorn.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { bgcolor: "#4A494E" },
                    borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <TableCell
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {item.combo_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {formatCurrency(item.combo_price)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {item.combo_quantity}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{
                    color: "#FFFFFF",
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    textAlign: "center",
                    borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  No snack & drink information available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          sx={{ width: "100%", fontSize: "1.25rem", color: "black" }}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
