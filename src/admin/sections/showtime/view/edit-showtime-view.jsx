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
        console.error(error);
        setSnackbar({
          open: true,
          message: "Error when loading showtime information",
          severity: "error",
        });
      }
    };

    fetchShowtimeDetails();
  }, [showtimeId]);

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

  useEffect(() => {
    const getFilmNames = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          setSnackbar({
            open: true,
            message: `Error when calling API: ${error.message}`,
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

  return (
    <DashboardContent>
      <Card>
        <CardHeader
          title={<Typography variant="h2">{"Edit Showtime"}</Typography>}
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
                      placeholder="Please select or enter a movie name"
                      required
                      fullWidth
                    />
                  )}
                />

                <TextField
                  name="room_name"
                  label="Theater Room Name"
                  value={formData.room_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />

                <TextField
                  name="cinema_name"
                  label="Cinema Name"
                  value={formData.cinema_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
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
                />
              </Stack>

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">
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
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
