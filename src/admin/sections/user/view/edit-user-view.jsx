import { useState, useEffect } from "react";
import { DashboardContent } from "../../../layouts/dashboard";
import {
  Card,
  Typography,
  Grid,
  Button,
  CardHeader,
  CardContent,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// thiếu một số trường full_name, sex, date_of_birth, date
export function EditUserView({ userId }) {
  const [formData, setFormData] = useState({
    username: "",
    user_img: "",
    email: "",
    phone_number: "",
    role: 0,
    status: 0,
  });
  const [orderData, setOrderData] = useState([]);

  const [currentImage, setCurrentImage] = useState("");

  const roleOptions = [
    { label: "User", value: 0 },
    { label: "Admin", value: 1 },
  ];
  const statusOptions = [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/users/detail/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        const user = data.user[0] || {};

        setFormData({
          username: user.username,
          user_img: user.user_img,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
          status: user.status,
        });

        setOrderData(data.order || []);
        setCurrentImage(user.user_img || "");
        setLoading(false);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Error loading user information.",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({ ...prev, user_img: file }));

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage(imageUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("status", formData.status);

    if (formData.user_img) {
      formDataToSend.append("user_img", formData.user_img);
    }

    try {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        console.error("JWT token is missing");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/edit/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + jwt,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setSnackbar({
        open: true,
        message: "User information has been successfully updated!.",
        severity: "success",
      });

      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while updating user information!.",
        severity: "error",
      });
    }
  };

  return (
    <DashboardContent>
      <Card>
        <CardHeader
          title={
            <Typography variant="h2">{"Edit user information"}</Typography>
          }
        />
        <CardContent>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Tên người dùng"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    {currentImage ? (
                      <Box>
                        <img
                          src={currentImage}
                          alt="Current Profile"
                          style={{
                            display: "block",
                            width: "100%",
                            maxWidth: "200px",
                            borderRadius: "8px",
                            margin: "0 auto",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: "200px",
                          height: "200px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "1px dashed gray",
                          borderRadius: "8px",
                          backgroundColor: "#f4f6f8",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No avatar available
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      sx={{
                        color: "gray",
                        borderColor: "gray",
                        textTransform: "none",
                      }}
                    >
                      Upload avatar
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Box>

                  <TextField
                    fullWidth
                    label="Phone number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                  />

                  <TextField
                    fullWidth
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    Update
                  </Button>
                </Box>
              </form>

              {/* Order Data Table */}
              {formData.role == 0 ? (
                <Box mt={5}>
                  <Typography variant="h2" gutterBottom>
                    Booking History
                  </Typography>

                  {orderData.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Booking Date</TableCell>
                            <TableCell>Movie Name</TableCell>
                            <TableCell>Cinema Name</TableCell>
                            <TableCell>Room Name</TableCell>
                            <TableCell>Show Date</TableCell>
                            <TableCell>Total Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderData.map((order) => (
                            <TableRow key={order.order_id}>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                {order.order_id}
                              </TableCell>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                {new Date(
                                  order.order_date
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                {order.film_name}
                              </TableCell>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                {order.cinema_name}
                              </TableCell>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                {order.room_name}
                              </TableCell>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                {new Date(order.show_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(order.total_price)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body1" color="text.secondary" mt={2}>
                      No orders have been placed.
                    </Typography>
                  )}
                </Box>
              ) : null}
            </>
          )}
        </CardContent>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            sx={{ fontSize: "1.25rem" }}
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Card>
    </DashboardContent>
  );
}
