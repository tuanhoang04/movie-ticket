import { useState, useEffect } from "react";
import { DashboardContent } from "../../../layouts/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export function EditCinemaView({ cinemaId }) {
  const [formData, setFormData] = useState({
    cinema_name: "",
    address: "",
    cluster_name: "",
    region_name: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchCinemaDetails = async () => {
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
          }/api/admin/cinemas/detail/${cinemaId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cinema details");
        }

        const data = await response.json();
        // console.log(data);
        const cinema = data.cinema[0] || {};
        const cluster = data.clusters[0] || {};
        const region = data.regions[0] || {};

        const initialData = {
          cinema_name: cinema.cinema_name || "",
          address: cinema.address || "",
          cluster_name: cluster.cluster_name || "",
          region_name: region.region_name || "",
        };

        setFormData(initialData);
        setOriginalData(initialData);
        setLoading(false);
      } catch (error) {
        // console.error(error);
        setSnackbar({
          open: true,
          message: "Error loading cinema information",
          severity: "error",
        });
        setLoading(false);
      }
    };

    fetchCinemaDetails();
  }, [cinemaId]);

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
        `${import.meta.env.VITE_API_URL}/api/admin/cinemas/edit/${cinemaId}`,
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
        throw new Error("Failed to update cinema");
      }

      // const result = await response.json();
      // console.log(result);
      setSnackbar({
        open: true,
        message: "Cinema has been successfully updated!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/cinema"), 1000);
    } catch (error) {
      // console.error(error);
      setFormData(originalData);
      setSnackbar({
        open: true,
        message: "An error occurred while updating the cinema!",
        severity: "error",
      });
    }
  };

  return (
    <DashboardContent>
      <Card>
        <CardHeader
          title={
            <Typography variant="h2">{"Edit Cinema Information"}</Typography>
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
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  name="cinema_name"
                  label="Cinema name"
                  value={formData.cinema_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />

                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />

                <Autocomplete
                  name="cluster_name"
                  options={[
                    "Beta Cinemas",
                    "CGV Cinemas",
                    "Lotte Cinemas",
                    "Cinestar",
                    "Mega GS Cinemas",
                    "Dcine",
                    "Đống Đa Cinema",
                    "Starlight",
                    "Rio Cinemas",
                    "Touch Cinema",
                    "Cinemax",
                    "Love",
                  ]}
                  isOptionEqualToValue={(option, value) =>
                    value !== null && option.value === value.value
                  }
                  value={formData.cluster_name}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, cluster_name: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Cinema cluster" required />
                  )}
                />

                <Autocomplete
                  name="region_name"
                  options={[
                    "Hà Nội",
                    "Tp.Hồ Chí Minh",
                    "Bình Dương",
                    "Đồng Nai",
                    "Cần Thơ",
                    "Đà Nẵng",
                    "Khánh Hòa",
                    "Lâm Đồng",
                    "Quảng Ninh",
                    "Bình Định",
                    "Bà Rịa-Vũng Tàu",
                    "Bắc Giang",
                    "Đắk Lắk",
                    "Gia Lai",
                    "Hải Phòng",
                    "Thừa-Thiên Huế",
                    "Kiên Giang",
                    "Kon Tum",
                    "Nghệ An",
                    "Quảng Bình",
                    "Quảng Nam",
                    "Sóc Trăng",
                    "Tây Ninh",
                    "Thái Nguyên",
                    "Thanh Hóa",
                    "Tiên Giang",
                    "An Giang",
                    "Bắc Ninh",
                    "Bình Thuận",
                    "Cà Mau",
                    "Đồng Tháp",
                    "Hà Nam",
                    "Hà Tĩnh",
                    "Hải Dương",
                    "Hậu Giang",
                    "Hưng Yên",
                    "Lạng Sơn",
                    "Lào Cai",
                    "Long An",
                    "Nam Định",
                    "Ninh BÌnh",
                    "Ninh Thuận",
                    "Phú Thọ",
                    "Quảng Ngãi",
                    "Quảng Trị",
                    "Sơn La",
                    "Trà Vinh",
                    "Tuyên Quang",
                    "Vĩnh Long",
                    "Yên Bái",
                  ]}
                  isOptionEqualToValue={(option, value) =>
                    value !== null && option.value === value.value
                  }
                  value={formData.region_name}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, region_name: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Location" required />
                  )}
                />
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
          )}
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
