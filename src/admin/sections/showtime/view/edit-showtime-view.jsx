import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardContent } from "../../../layouts/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  TextField,
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
  MenuItem,
} from "@mui/material";

export function EditShowtimeView({ showtimeId }) {
  const [formData, setFormData] = useState({
    film_name: "",
    room_name: "",
    cinema_name: "",
    show_date: "",
    show_time: "",
  });

  const [filmNames, setFilmNames] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchShowtimeDetails = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          setSnackbar({
            open: true,
            message: "JWT token is missing",
            severity: "error",
          });
          return;
        }

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/showtimes/detail/${showtimeId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch showtime details");
        }
        const data = await response.json();

        const showDate = data.showTime[0]?.show_date || "";
        const formattedShowDate = showDate
          ? new Date(showDate).toLocaleDateString("en-CA")
          : "";

        const initialData = {
          film_name: data.film[0]?.film_name || "",
          room_name: data.room[0]?.room_name || "",
          cinema_name: data.cinema[0]?.cinema_name || "",
          show_date: formattedShowDate,
          show_time: data.showTime[0]?.show_time || "",
        };

        setFormData(initialData);
        setOriginalData(initialData);
        setLoading(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error when loading showtime information",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchShowtimeDetails();
  }, [showtimeId]);

  useEffect(() => {
    const getFilmNames = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          setSnackbar({
            open: true,
            message: "JWT token is missing",
            severity: "error",
          });
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/films`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch films");
        }

        const listfilms = await response.json();
        setFilmNames(listfilms.map((film) => film.film_name));
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Error when calling API: ${error.message}`,
          severity: "error",
        });
      }
    };

    getFilmNames();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        console.error("JWT token is missing");
        setSnackbar({
          open: true,
          message: "JWT token is missing",
          severity: "error",
        });
        return;
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/showtimes/edit/${showtimeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update showtime");
      }

      setSnackbar({
        open: true,
        message: "The film showtime has been successfully updated!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/showtime"), 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while updating the showtime!",
        severity: "error",
      });

      setFormData(originalData);
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
              variant="h3"
              sx={{ color: "#FFFFFF", fontWeight: "bold" }}
            >
              Edit Showtime
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
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Autocomplete
                  name="film_name"
                  options={filmNames}
                  isOptionEqualToValue={(option, value) => option === value}
                  value={formData.film_name}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, film_name: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Film name"
                      placeholder="Please select or enter a movie name"
                      required
                      fullWidth
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
                        ...params.InputProps,
                        sx: {
                          "&::placeholder": {
                            color: "rgba(255, 255, 255, 0.7)",
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <MenuItem
                      {...props}
                      sx={{
                        color: "#000000",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      }}
                    >
                      {option}
                    </MenuItem>
                  )}
                />

                <TextField
                  name="room_name"
                  label="Theater Room Name"
                  value={formData.room_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
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
                  name="cinema_name"
                  label="Cinema Name"
                  value={formData.cinema_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
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
                  name="show_date"
                  label="Show Date"
                  type="date"
                  value={formData.show_date}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                />

                <TextField
                  name="show_time"
                  label="Show Time"
                  type="time"
                  value={formData.show_time}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                />
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