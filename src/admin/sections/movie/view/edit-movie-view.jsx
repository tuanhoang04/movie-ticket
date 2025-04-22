import { useState, useEffect } from "react";
import { DashboardContent } from "../../../layouts/dashboard";
import { Card, CardContent, CardHeader, Typography, Box, Button, Stack, TextField, Snackbar, Alert, MenuItem, CircularProgress, Autocomplete, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function EditMovieView({ movieId }) {
    const [formData, setFormData] = useState({
        film_name: "",
        film_img: null,
        film_trailer: "",
        Release_date: "",
        film_describe: "",
        age_limit: 5,
        duration: "",
        film_type: 1,
        country: 1,
        categories: [],
        directors: [],
        actors: [],
    });

    const [initialFormData, setInitialFormData] = useState(formData);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const filmTypeOptions = [
        { value: 1, label: "Đang chiếu" },
        { value: 0, label: "Sắp chiếu" },
    ];

    // const filmTypeOptions = [
    //     { value: 0, label: "Ngừng chiếu" },
    //     { value: 1, label: "Đang chiếu" },
    //     { value: 2, label: "Sắp chiếu" },
    // ];

    const countryOptions = [
        { value: "1", label: "Việt Nam" },
        { value: "0", label: "Nước ngoài" },
    ];

    const handleSnackbarClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {

            try {
                const jwt = localStorage.getItem('jwt');

                if (!jwt) {
                    console.error('JWT token is missing');
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/films/detail/${movieId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + jwt,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch movie details");
                }
                const data = await response.json();

                // console.log(data.categories?.map((cat) => cat.category_name) || []);
                // console.log(data.directors?.map((dir) => dir.director_name) || []);
                // console.log(data.actors?.map((actor) => actor.actor_name) || []);

                const fetchedData = {
                    film_name: data.film[0]?.film_name,
                    film_img: data.film[0].film_img,
                    film_trailer: data.film[0]?.film_trailer,
                    Release_date: new Date(data.film[0]?.Release_date).toLocaleDateString("en-CA"),
                    film_describe: data.film[0]?.film_describe,
                    age_limit: data.film[0]?.age_limit,
                    duration: data.film[0]?.duration,
                    film_type: data.film[0]?.film_type,
                    country: data.film[0]?.country,

                    actors: [...new Set(data.actors?.map((actor) => actor.actor_name) || [])],
                    directors: [...new Set(data.directors?.map((dir) => dir.director_name) || [])],
                    categories: [...new Set(data.categories?.map((cat) => cat.category_name) || [])],
                };

                // console.log([...new Set(data.categories?.map((cat) => cat.category_name))]);

                setFormData(fetchedData);
                setInitialFormData(fetchedData);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: "Lỗi khi tải thông tin phim", severity: "error" });

                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const handleImageReset = () => {
        setFormData((prev) => ({ ...prev, film_img: null }));
    };

    const handleAddPoster = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({ ...prev, film_img: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // console.log("Submitting form:", formData);

        const formDataObj = new FormData();

        formDataObj.append("film_name", formData.film_name);
        formDataObj.append("film_trailer", formData.film_trailer);
        formDataObj.append("Release_date", formData.Release_date);
        formDataObj.append("film_describe", formData.film_describe);
        formDataObj.append("age_limit", formData.age_limit);
        formDataObj.append("duration", formData.duration);
        formDataObj.append("film_type", formData.film_type);
        formDataObj.append("country", formData.country);

        if (formData.film_img) {
            formDataObj.append("film_img", formData.film_img); // Append the file as a Blob
        }

        // console.log(formData.categories);
        // console.log(formData.directors);
        // console.log(formData.actors);

        formDataObj.append("categories", formData.categories);
        formDataObj.append("directors", formData.directors);
        formDataObj.append("actors", formData.actors);

        // for (let pair of formDataObj.entries()) {
        //     console.log(pair[0] + ": " + pair[1]);
        // }

        try {
            const jwt = localStorage.getItem('jwt');

            if (!jwt) {
                console.error('JWT token is missing');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/films/edit/${movieId}`, {
                method: "PATCH",
                headers: {
                    'Authorization': 'Bearer ' + jwt,
                },
                body: formDataObj,
            });

            if (!response.ok) {
                throw new Error("Failed to update movie");
            }

            // const result = await response.json();
            // console.log(result);
            setSnackbar({ open: true, message: "Phim đã được cập nhật thành công!", severity: "success" });
            setTimeout(() => navigate("/admin/movie"), 1000);
        } catch (error) {
            //console.error(error);
            setSnackbar({ open: true, message: "Có lỗi xảy ra khi cập nhật phim!", severity: "error" });
            setFormData(initialFormData);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        try {
            const regexShort = /(?:https?:\/\/)?youtu\.be\/([^&\s]+)/;
            const matchShort = url.match(regexShort);
            if (matchShort) {
                return `https://www.youtube.com/embed/${matchShort[1]}`;
            }

            const regexWatch = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\s]+)/;
            const matchWatch = url.match(regexWatch);
            if (matchWatch) {
                return `https://www.youtube.com/embed/${matchWatch[1]}`;
            }

            return url;
        } catch (error) {
            console.error("Error transforming YouTube URL:", error);
            return url;
        }
    };

    return (
        <DashboardContent>
            <Card>
                <CardHeader
                    title={<Typography variant="h2">{'Chỉnh sửa thông tin phim'}</Typography>}
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
                                {/* film name input */}
                                <TextField
                                    name="film_name"
                                    label="Tên phim"
                                    value={formData.film_name}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />

                                {/* display image and image input */}
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    sx={{
                                        width: "300px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "300px",
                                            height: "450px",
                                            backgroundColor: "#e0e0e0",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            position: "relative",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {formData.film_img ? (
                                            <img
                                                src={formData.film_img}
                                                alt="Movie Poster"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                    objectPosition: "center",
                                                }}
                                            />
                                        ) : (
                                            <Typography
                                                variant="caption"
                                                color="textSecondary"
                                                sx={{ textAlign: "center" }}
                                            >
                                                Chưa có poster phim
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ marginTop: "10px" }}>
                                        {formData.film_img ? (
                                            <Button
                                                onClick={handleImageReset}
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                            >
                                                Xóa poster phim
                                            </Button>
                                        ) : (
                                            <>
                                                <input
                                                    accept="image/*"
                                                    id="upload-poster"
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    onChange={handleAddPoster}
                                                />
                                                <label htmlFor="upload-poster">
                                                    <Button
                                                        variant="outlined"
                                                        color="info"
                                                        size="small"
                                                        component="span"
                                                    >
                                                        Thêm poster phim
                                                    </Button>
                                                </label>
                                            </>
                                        )}
                                    </Box>
                                </Box>

                                {/* display trailer and trailer input */}
                                {formData.film_trailer && (
                                    <Box>
                                        <iframe
                                            width="50%"
                                            height="315"
                                            src={getYouTubeEmbedUrl(formData.film_trailer)}
                                            title="Movie Trailer"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </Box>
                                )}
                                <TextField
                                    name="film_trailer"
                                    label="Trailer URL (Shortened URL or Standard URL)"
                                    value={formData.film_trailer}
                                    onChange={handleInputChange}
                                    fullWidth
                                />

                                <TextField
                                    name="Release_date"
                                    label="Ngày phát hành"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.Release_date}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    name="film_describe"
                                    label="Mô tả"
                                    value={formData.film_describe}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={15}
                                    required
                                    fullWidth
                                />

                                <Autocomplete
                                    name="age_limit"
                                    options={[
                                        5, 13, 16, 18
                                    ]}
                                    isOptionEqualToValue={(option, value) => value !== null && option.value === value.value}
                                    value={formData.age_limit}
                                    onChange={(event, newValue) => {
                                        setFormData({ ...formData, age_limit: newValue });
                                    }}
                                    getOptionLabel={(option) => option.toString()}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="age_limit"
                                            label="Giới hạn độ tuổi"
                                            type="number"
                                            fullWidth
                                            required
                                        />
                                    )}
                                />

                                {/* <TextField
                                    name="age_limit"
                                    label="Giới hạn độ tuổi"
                                    type="number"
                                    value={formData.age_limit}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                /> */}

                                <TextField
                                    name="duration"
                                    label="Thời lượng (phút)"
                                    type="number"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    name="film_type"
                                    label="Trạng thái phim"
                                    select
                                    value={formData.film_type}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                >
                                    {filmTypeOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    name="country"
                                    label="Quốc gia"
                                    select
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                >
                                    {countryOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Autocomplete
                                    name="categories"
                                    multiple
                                    freeSolo
                                    options={[
                                        "Kinh Dị", "Hài Kịch", "Hành Động", "Tội Phạm",
                                        "Phiêu Lưu", "Hoạt Hình", "Gia Đình",
                                        "Khoa Học Viễn Tưởng", "Bí Ẩn", "Giả Tưởng",
                                        "Lãng Mạng", "Drama", "Giật Gân", "Âm Nhạc",
                                        "Tiểu Sử", "Lịch Sử", "Chiến Tranh"
                                    ]}
                                    value={formData.categories}
                                    onChange={(event, value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            categories: value
                                        }));
                                    }}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                key={option}
                                                label={option}
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Thể loại"
                                            placeholder="Thêm thể loại (cách nhau bởi dấu phẩy)"
                                        />
                                    )}
                                />

                                <TextField
                                    name="directors"
                                    label="Đạo diễn"
                                    placeholder="Thêm đạo diễn (cách nhau bởi dấu phẩy)"
                                    value={formData.directors.join(', ')}
                                    onChange={(event) => {
                                        const inputValue = event.target.value;
                                        const directorsArray = inputValue.split(',').map(item => item.trim());
                                        setFormData((prev) => ({
                                            ...prev,
                                            directors: directorsArray
                                        }));
                                    }}
                                    fullWidth
                                />

                                <TextField
                                    name="actors"
                                    label="Diễn viên"
                                    placeholder="Thêm diễn viên (cách nhau bởi dấu phẩy)"
                                    value={formData.actors.join(', ')}
                                    onChange={(event) => {
                                        const inputValue = event.target.value;
                                        const actorsArray = inputValue.split(',').map(item => item.trim());
                                        setFormData((prev) => ({
                                            ...prev,
                                            actors: actorsArray
                                        }));
                                    }}
                                    fullWidth
                                />
                            </Stack>

                            <Box mt={3} display="flex" justifyContent="flex-end">
                                <Button type="submit" variant="contained" color="primary">
                                    Cập nhật
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