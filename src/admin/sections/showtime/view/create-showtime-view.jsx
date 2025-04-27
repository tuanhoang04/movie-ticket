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
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);

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
        setSnackbar({
          open: true,
          message: "Failed to create showtime!",
          severity: "error",
        });
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
        message: "An error occurred while creating the showtime!" + error,
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
    const fetchCinemaData = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/cinemas`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        const result = await response.json();

        const cList = [];
        result.forEach((element, index) => {
          cList[index] = element.cinema_name;
        });

        setCinemas(cList);
      } catch (error) {
        console.error("Error fetching cinema data:", error);
      }
    };

    fetchCinemaData();
  }, []);

  useEffect(() => {
    const getFilmNames = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          setSnackbar({
            open: true,
            message: `Please login first`,
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
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }
        console.log(formData.cinema_name);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/rooms/cinema?cinema_name=${
            formData.cinema_name
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch rooms");

        const data = await response.json();

        setRooms(
          data
            .map((room) => room.room_name)
            .sort((a, b) => {
              const numA = parseInt(a.split("_")[1]);
              const numB = parseInt(b.split("_")[1]);
              return numA - numB;
            })
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchRooms();
  }, [formData.cinema_name]);
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
              <Autocomplete
                name="cinema_name"
                options={cinemas}
                value={formData.cinema_name}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, cinema_name: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cinema name"
                    placeholder="Please select or enter the cinema name"
                    required
                  />
                )}
              />
              {formData.cinema_name ? (
                <Autocomplete
                  name="room_name"
                  options={rooms}
                  value={formData.room_name}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, room_name: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="room name"
                      placeholder="Please select or enter the room name"
                      required
                    />
                  )}
                />
              ) : (
                ""
              )}

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
