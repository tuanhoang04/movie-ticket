import { Card, CardHeader, CardContent, Typography, Stack, TextField, Snackbar, Alert, Box, Button, Autocomplete } from "@mui/material";
import { DashboardContent } from "../../../layouts/dashboard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateCinemaView() {
    const [formData, setFormData] = useState({
        cinema_name: "",
        cluster_name: "",
        region_name: "",
        address: "",
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();

    const handleSnackbarClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const jwt = localStorage.getItem('jwt');

            if (!jwt) {
                console.error('JWT token is missing');
                setSnackbar({ open: true, message: "JWT token is missing", severity: "error" });
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/cinemas/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + jwt,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create cinema");
            }

            // const result = await response.json();
            // console.log(result);

            setSnackbar({ open: true, message: "Rạp chiếu phim đã được tạo thành công!", severity: "success" });
            setTimeout(() => navigate("/admin/cinema"), 1000);
        } catch (error) {
            // console.error(error);
            setFormData({
                cinema_name: "",
                address: "",
                cluster_name: "",
                region_name: "",
            });
            setSnackbar({ open: true, message: "Có lỗi xảy ra khi tạo rạp chiếu phim!", severity: "error" });
        }
    };

    return (
        <DashboardContent>
            <Card>
                <CardHeader
                    title={<Typography variant="h2">{'Mẫu tạo rạp chiếu phim mới'}</Typography>}
                />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                name="cinema_name"
                                label="Tên rạp"
                                value={formData.cinema_name}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />

                            <TextField
                                name="address"
                                label="Địa chỉ"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />

                            <Autocomplete
                                name="cluster_name"
                                options={[
                                    'Beta Cinemas',
                                    'CGV Cinemas',
                                    'Lotte Cinemas',
                                    'Cinestar',
                                    'Mega GS Cinemas',
                                    'Dcine',
                                    'Đống Đa Cinema',
                                    'Starlight',
                                    'Rio Cinemas',
                                    'Touch Cinema',
                                    'Cinemax',
                                    'Love'
                                ]}
                                isOptionEqualToValue={(option, value) => value !== null && option.value === value.value}
                                value={formData.cluster_name}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, cluster_name: newValue });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tên cụm rạp"
                                        required
                                    />
                                )}
                            />

                            <Autocomplete
                                name="region_name"
                                options={[
                                    "Hà Nội", "Tp.Hồ Chí Minh", "Bình Dương", "Đồng Nai", "Cần Thơ", "Đà Nẵng",
                                    "Khánh Hòa", "Lâm Đồng", "Quảng Ninh", "Bình Định", "Bà Rịa-Vũng Tàu", "Bắc Giang",
                                    "Đắk Lắk", "Gia Lai", "Hải Phòng", "Thừa-Thiên Huế", "Kiên Giang",
                                    "Kon Tum", "Nghệ An", "Quảng Bình", "Quảng Nam", "Sóc Trăng", "Tây Ninh", "Thái Nguyên",
                                    "Thanh Hóa", "Tiên Giang", "An Giang", "Bắc Ninh", "Bình Thuận", "Cà Mau", "Đồng Tháp",
                                    "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hưng Yên", "Lạng Sơn", "Lào Cai",
                                    "Long An", "Nam Định", "Ninh BÌnh", "Ninh Thuận", "Phú Thọ", "Quảng Ngãi", "Quảng Trị",
                                    "Sơn La", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Yên Bái"
                                ]}
                                isOptionEqualToValue={(option, value) => value !== null && option.value === value.value}
                                value={formData.region_name}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, region_name: newValue });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Khu vực"
                                        required
                                    />
                                )}
                            />

                        </Stack>

                        <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button type="submit" variant="contained" color="primary">
                                Tạo rạp chiếu
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
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </DashboardContent>
    );
}
