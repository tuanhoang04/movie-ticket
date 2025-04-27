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
  MenuItem,
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
        message: "An error occurred while creating the showtime! " + error,
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
            message: "Please login first",
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

    if (formData.cinema_name) {
      fetchRooms();
    }
  }, [formData.cinema_name]);

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
              Create Showtime
            </Typography>
          }
          sx={{ bgcolor: "#323137" }}
        />
        <CardContent sx={{ bgcolor: "#323137" }}>
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
                    placeholder="Please select or enter the film name"
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

              <Autocomplete
                name="cinema_name"
                options={cinemas}
                isOptionEqualToValue={(option, value) => option === value}
                value={formData.cinema_name}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    cinema_name: newValue,
                    room_name: "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cinema name"
                    placeholder="Please select or enter the cinema name"
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

              {formData.cinema_name ? (
                <Autocomplete
                  name="room_name"
                  options={rooms}
                  isOptionEqualToValue={(option, value) => option === value}
                  value={formData.room_name}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, room_name: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Room name"
                      placeholder="Please select or enter the room name"
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
              ) : null}

              <TextField
                name="show_date"
                label="Show date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.show_date}
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
                }}
              >
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
    </DashboardContent>
  );
}
