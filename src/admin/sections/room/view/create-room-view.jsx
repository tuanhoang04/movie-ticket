import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Box,
  Button,
  Autocomplete,
} from "@mui/material";
import { DashboardContent } from "../../../layouts/dashboard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function CreateRoomView() {
  const navigate = useNavigate();
  const [cinemaList, setCinemaList] = useState([]);
  const [formData, setFormData] = useState({
    room_name: "",
    cinema_name: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchCinemaData = async () => {
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
          `${import.meta.env.VITE_API_URL}/api/admin/cinemas`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cinemas");
        }

        const result = await response.json();
        const cList = result.map((element) => element.cinema_name);
        setCinemaList(cList);
      } catch (error) {
        console.error("Error fetching cinema data:", error);
        setSnackbar({
          open: true,
          message: "Error fetching cinema data: " + error.message,
          severity: "error",
        });
      }
    };

    fetchCinemaData();
  }, []);

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        `${import.meta.env.VITE_API_URL}/api/admin/rooms/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      setSnackbar({
        open: true,
        message: "Create room successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/room"), 1000);
    } catch (error) {
      setFormData({
        room_name: "",
        cinema_name: "",
      });
      setSnackbar({
        open: true,
        message: "Something went wrong when creating room: " + error.message,
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
              variant="h3"
              sx={{ color: "#FFFFFF", fontWeight: "bold" }}
            >
              Create Room
            </Typography>
          }
          sx={{ bgcolor: "#323137" }}
        />
        <CardContent sx={{ bgcolor: "#323137" }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                name="room_name"
                label="Room name"
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

              <Autocomplete
                freeSolo
                options={cinemaList}
                value={formData.cinema_name}
                onChange={(event, value) => {
                  setFormData((prev) => ({
                    ...prev,
                    cinema_name: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cinema name"
                    placeholder="Choose cinema"
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
                Create room
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
          sx={{ width: "100%", fontSize: "1.25rem", color: "#FFFFFF" }}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}