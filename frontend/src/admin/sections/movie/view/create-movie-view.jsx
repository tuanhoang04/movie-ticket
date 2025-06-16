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

export function CreateMovieView() {
  const navigate = useNavigate();
  const [directorList, setDirectorList] = useState([]);
  const [actorList, setActorList] = useState([]);
  const [preview, setPreview] = useState(null);

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

  useEffect(() => {
    const fetchDirectorData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/directors`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        const dirList = [];
        result.forEach((element, index) => {
          dirList[index] = element.director_name;
        });

        setDirectorList(dirList);
      } catch (error) {
        console.error("Error fetching directors data:", error);
      }
    };

    fetchDirectorData();
  }, []);

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/actor`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        const actorList = [];
        result.forEach((element, index) => {
          actorList[index] = element.actor_name;
        });

        setActorList(actorList);
      } catch (error) {
        console.error("Error fetching actors data:", error);
      }
    };

    fetchActorData();
  }, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const filmTypeOptions = [
    { value: "1", label: "Now showing" },
    { value: "0", label: "Upcoming" },
  ];

  const countryOptions = [
    { value: "1", label: "Vietnam" },
    { value: "0", label: "Worldwide" },
  ];

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageReset = () => {
    setFormData((prev) => ({ ...prev, film_img: null }));
    setPreview(null);
  };

  const handleAddPoster = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, film_img: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImg = async () => {
    if (!formData.film_img) {
      alert("Please select an image file to upload.");
      return;
    }
    const formData2 = new FormData();
    formData2.append("image", formData.film_img);
    formData2.append("name", formData.film_name);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/uploadImage/film`,
        formData2,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("URL ảnh:", response.data.message.url);
      } else {
        window.alert("fail upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("film_name", formData.film_name);
    formDataObj.append("film_trailer", formData.film_trailer);
    formDataObj.append("Release_date", formData.Release_date);
    formDataObj.append("film_describe", formData.film_describe);
    formDataObj.append("age_limit", formData.age_limit);
    formDataObj.append("duration", formData.duration);
    formDataObj.append("film_type", formData.film_type);
    formDataObj.append("country", formData.country);
    formDataObj.append("actors", formData.actors);
    formDataObj.append("directors", formData.directors);
    formDataObj.append("categories", formData.categories);

    try {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        console.error("JWT token is missing");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/films/create`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + jwt,
          },
          body: formDataObj,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create movie");
      }

      setSnackbar({
        open: true,
        message: "Adding film successfully",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/movie"), 1000);
    } catch (error) {
      setFormData({
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
      console.log(error);

      setSnackbar({
        open: true,
        message: "Something wrong when adding film!",
        severity: "error",
      });
    }
    await handleImg();
  };

  const getYouTubeEmbedUrl = (url) => {
    try {
      const regexShort = /(?:https?:\/\/)?youtu\.be\/([^&\s]+)/;
      const matchShort = url.match(regexShort);
      if (matchShort) {
        return `https://www.youtube.com/embed/${matchShort[1]}`;
      }

      const regexWatch =
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\s]+)/;
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
              Create Movie
            </Typography>
          }
          sx={{ bgcolor: "#323137" }}
        />
        <CardContent sx={{ bgcolor: "#323137" }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                name="film_name"
                label="Film name"
                value={formData.film_name}
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
                    backgroundColor: "#4A494E",
                    border: "1px solid #FFFFFF",
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
                      src={preview}
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
                      sx={{
                        color: "#FFFFFF",
                        textAlign: "center",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      }}
                    >
                      No poster found
                    </Typography>
                  )}
                </Box>

                <Box sx={{ marginTop: "10px" }}>
                  {formData.film_img ? (
                    <Button
                      onClick={handleImageReset}
                      variant="outlined"
                      sx={{
                        color: "#FF0000",
                        borderColor: "#FF0000",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                        "&:hover": {
                          borderColor: "#FF0000",
                          backgroundColor: "rgba(255, 0, 0, 0.1)",
                        },
                      }}
                      size="small"
                    >
                      Delete poster
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
                          sx={{
                            color: "#1976D2",
                            borderColor: "#1976D2",
                            fontSize: { xs: "1.1rem", md: "1.2rem" },
                            "&:hover": {
                              borderColor: "#1976D2",
                              backgroundColor: "rgba(25, 118, 210, 0.1)",
                            },
                          }}
                          size="small"
                          component="span"
                        >
                          Add poster
                        </Button>
                      </label>
                    </>
                  )}
                </Box>
              </Box>

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
                name="Release_date"
                label="Release date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.Release_date}
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
                name="film_describe"
                label="Description"
                value={formData.film_describe}
                onChange={handleInputChange}
                multiline
                rows={4}
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
                name="age_limit"
                options={[5, 13, 16, 18]}
                isOptionEqualToValue={(option, value) =>
                  value !== null && option === value
                }
                value={formData.age_limit}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, age_limit: newValue });
                }}
                getOptionLabel={(option) => option.toString()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="age_limit"
                    label="Age limit"
                    type="number"
                    fullWidth
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

              <TextField
                name="duration"
                label="Duration (min)"
                type="number"
                value={formData.duration}
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
                name="film_type"
                label="Film status"
                select
                value={formData.film_type}
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
                  "& .MuiSvgIcon-root": { color: "#FFFFFF" },
                }}
              >
                {filmTypeOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      color: "#000000",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="country"
                label="Country"
                select
                value={formData.country}
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
                  "& .MuiSvgIcon-root": { color: "#FFFFFF" },
                }}
              >
                {countryOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      color: "#000000",
                      fontSize: { xs: "1.1rem", md: "1.2rem" },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                multiple
                freeSolo
                options={[
                  "Horror",
                  "Comedy",
                  "Action",
                  "Crime",
                  "Adventure",
                  "Animation",
                  "Family",
                  "Science Fiction",
                  "Mystery",
                  "Fantasy",
                  "Romance",
                  "Drama",
                  "Thriller",
                  "Music",
                  "Biography",
                  "History",
                  "War",
                ]}
                value={formData.categories}
                onChange={(event, value) => {
                  setFormData((prev) => ({
                    ...prev,
                    categories: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    placeholder="Add categories"
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
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      label={option}
                      sx={{
                        bgcolor: "#1976D2",
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      }}
                    />
                  ))
                }
              />

              <Autocomplete
                multiple
                freeSolo
                options={directorList}
                value={formData.directors}
                onChange={(event, value) => {
                  setFormData((prev) => ({
                    ...prev,
                    directors: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Directors"
                    placeholder="Add directors"
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
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      label={option}
                      sx={{
                        bgcolor: "#1976D2",
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      }}
                    />
                  ))
                }
              />

              <Autocomplete
                multiple
                freeSolo
                options={actorList}
                value={formData.actors}
                onChange={(event, value) => {
                  setFormData((prev) => ({
                    ...prev,
                    actors: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Actors"
                    placeholder="Add actors"
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
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      label={option}
                      sx={{
                        bgcolor: "#1976D2",
                        color: "#FFFFFF",
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                      }}
                    />
                  ))
                }
              />

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
                  Create film
                </Button>
              </Box>
            </Stack>
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
