import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  TextField,
  Snackbar,
  Alert,
  Box,
  Button,
  Autocomplete,
} from "@mui/material";
import { DashboardContent } from "../../../layouts/dashboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateShowtimeView() {
  const [formData, setFormData] = useState({
    film_name: "",
    room_name: "",
    cinema_name: "",
    show_date: "",
    show_time: "",
  });

  const [filmNames, setFilmNames] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Hàm xử lý thay đổi input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      show_date: formData.show_date,
      show_time: formData.show_time,
    };

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
        `${import.meta.env.VITE_API_URL}/api/admin/showtimes/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create showtime");
      }

      setSnackbar({
        open: true,
        message: "The showtime has been successfully created!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/showtime"), 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while creating the showtime!",
        severity: "error",
      });

      setFormData({
        film_name: "",
        room_name: "",
        cinema_name: "",
        show_date: "",
        show_time: "",
      });
    }
  };

  useEffect(() => {
    const getFilmNames = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          setSnackbar({
            open: true,
            message: `Error calling the API: ${error.message}`,
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
          message: `Error calling the API: ${error.message}`,
          severity: "error",
        });
      }
    };

    getFilmNames();
  }, []);

  return (
    <DashboardContent>
      <Card>
        <CardHeader
          title={
            <Typography variant="h2">
              {"New Showtime Creation Template"}
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Autocomplete
                name="film_name"
                options={filmNames}
                isOptionEqualToValue={(option, value) =>
                  value !== null && option.value === value.value
                }
                value={formData.film_name}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, film_name: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Film name"
                    placeholder="Please select or enter the film name"
                    required
                  />
                )}
              />

              <TextField
                name="room_name"
                label="Room name"
                value={formData.room_name}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                name="cinema_name"
                label="Cinema name"
                value={formData.cinema_name}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                name="show_date"
                label="Show date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.show_date}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                name="show_time"
                label="Show time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.show_time}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Stack>

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                Create showtime
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          sx={{ fontSize: "1.25rem" }}
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
