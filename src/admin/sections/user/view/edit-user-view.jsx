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
} from "@mui/material";

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
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const roleOptions = [
    { label: "User", value: 0 },
    { label: "Admin", value: 1 },
  ];
  const statusOptions = [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const navigate = useNavigate();

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          setSnackbar({
            open: true,
            message: "JWT token is missing",
            severity: "error",
          });
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
          username: user.username || "",
          user_img: user.user_img || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          role: user.role || 0,
          status: user.status || 0,
        });

        setOrderData(data.order || []);
        setCurrentImage(user.user_img || "");
        setLoading(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error loading user information: " + error.message,
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
        setSnackbar({
          open: true,
          message: "JWT token is missing",
          severity: "error",
        });
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
        message: "User information has been successfully updated!",
        severity: "success",
      });

      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while updating user information: " + error.message,
        severity: "error",
      });
    }
  };

  return (
    <DashboardContent>
      <Card
        sx={{
          bgcolor: "#323137",
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="h2"
              sx={{ color: "#FFFFFF", fontWeight: "bold" }}
            >
              Edit user information
            </Typography>
          }
          sx={{ bgcolor: "#323137" }}
        />
        <CardContent sx={{ bgcolor: "#323137" }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
            >
              <CircularProgress sx={{ color: "#FFFFFF" }} />
            </Box>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                    }}
                    InputProps={{
                      sx: {
                        "&::placeholder": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                    }}
                    InputProps={{
                      sx: {
                        "&::placeholder": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                    }}
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
                          border: "1px dashed #FFFFFF",
                          borderRadius: "8px",
                          backgroundColor: "#4A494E",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#FFFFFF",
                            fontSize: { xs: "1.1rem", md: "1.2rem" },
                          }}
                        >
                          No avatar available
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      sx={{
                        color: "#1976D2",
                        borderColor: "#1976D2",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#1976D2",
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                        },
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
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                    }}
                    InputProps={{
                      sx: {
                        "&::placeholder": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "& .MuiSvgIcon-root": { color: "#FFFFFF" },
                    }}
                  >
                    {roleOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                          color: "#000000",
                          fontSize: { xs: "1.1rem", md: "1.2rem" },
                        }}
                      >
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
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFFFFF",
                      },
                      "& .MuiSvgIcon-root": { color: "#FFFFFF" },
                    }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                          color: "#000000",
                          fontSize: { xs: "1.1rem", md: "1.2rem" },
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#1976D2",
                      color: "#FFFFFF",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                      "&:hover": {
                        bgcolor: "#1565C0",
                      },
                      "&:disabled": {
                        bgcolor: "#4A494E",
                        color: "rgba(255, 255, 255, 0.5)",
                      },
                    }}
                    disabled={loading}
                  >
                    Update
                  </Button>
                </Box>
              </form>

              {formData.role === 0 ? (
                <Box mt={5}>
                  <Typography
                    variant="h2"
                    gutterBottom
                    sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                  >
                    Booking History
                  </Typography>

                  {orderData.length > 0 ? (
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
                              Order ID
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "1.1rem", md: "1.2rem" },
                                borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              Booking Date
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "1.1rem", md: "1.2rem" },
                                borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              Movie Name
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "1.1rem", md: "1.2rem" },
                                borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              Cinema Name
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "1.1rem", md: "1.2rem" },
                                borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              Room Name
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "1.1rem", md: "1.2rem" },
                                borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              Show Date
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "1.1rem", md: "1.2rem" },
                                borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              Total Amount
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderData.map((order) => (
                            <TableRow
                              key={order.order_id}
                              sx={{
                                "&:hover": { bgcolor: "#4A494E" },
                                borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                              }}
                            >
                              <TableCell
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                                  fontWeight: "medium",
                                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                                }}
                              >
                                {order.order_id}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                                  fontWeight: "medium",
                                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                                }}
                              >
                                {new Date(
                                  order.order_date
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                                  fontWeight: "medium",
                                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                                }}
                              >
                                {order.film_name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                                  fontWeight: "medium",
                                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                                }}
                              >
                                {order.cinema_name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                                  fontWeight: "medium",
                                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                                }}
                              >
                                {order.room_name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                                  fontWeight: "medium",
                                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                                }}
                              >
                                {new Date(order.show_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                                  fontWeight: "medium",
                                  borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
                                }}
                              >
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
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                        mt: 2,
                      }}
                    >
                      No orders have been placed.
                    </Typography>
                  )}
                </Box>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          sx={{ width: "100%", fontSize: "1.25rem", color: "#FFFFFF" }}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}