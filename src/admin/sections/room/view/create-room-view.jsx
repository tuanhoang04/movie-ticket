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
  Chip,
} from "@mui/material";
import { DashboardContent } from "../../../layouts/dashboard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function CreateRoomView() {
  const navigate = useNavigate();
  const [cinemaList, setCinemaList] = useState([]);
  const [formData, setFormData] = useState({
    room_name: "",
    cinema_name: "",
  });

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

        setCinemaList(cList);
      } catch (error) {
        console.error("Error fetching cinema data:", error);
      }
    };

    fetchCinemaData();
  }, []);
  const [snackbar, setSnackbar] = useState({
    open: true,
    message: "asd",
    severity: "success",
  });

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
        setSnackbar({
          open: true,
          message: "Failed to create movie",
          severity: "error",
        });
        throw new Error("Failed to create movie");
      }

      // const result = await response.json();
      // console.log(result);
      setSnackbar({
        open: true,
        message: "Create room successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/room"), 1000);
    } catch (error) {
      // console.error(error);
      setFormData({
        room_name: "",
        cinema_name: "",
      });
      console.log(error);

      setSnackbar({
        open: true,
        message: "Something wrong when create room",
        severity: "error",
      });
    }
  };

  return (
    <DashboardContent>
      <Card>
        <CardHeader
          title={<Typography variant="h2">Room creation form</Typography>}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                name="room_name"
                label="Room name"
                value={formData.room_name}
                onChange={handleInputChange}
                fullWidth
              />

              <Autocomplete
                freeSolo
                options={cinemaList}
                value={formData.cinema_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cinema name"
                    placeholder="Choose cinema"
                  />
                )}
                onChange={(event, value) => {
                  setFormData((prev) => ({
                    ...prev,
                    cinema_name: value,
                  }));
                }}
              />
            </Stack>

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
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
