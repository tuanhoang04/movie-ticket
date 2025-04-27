import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { Iconify } from "../../components/iconify";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
 
export function MovieTableToolbar({
  numSelected,
  filterName,
  selectedFilter,
  onFilterName,
  onFilterChange,
  onDeleteSelected,
}) {
  const filterOptions = [
    { value: "film_name", label: "Film name" },
    { value: "film_describe", label: "Description" },
  ];
 
  return (
    <Toolbar
      sx={{
        height: 120,
        display: "flex",
        justifyContent: "space-between",
        p: (theme) => theme.spacing(0, 2, 0, 4),
        bgcolor: "#323137", // Set background to #323137
        color: "#FFFFFF", // White text
        ...(numSelected > 0 && {
          bgcolor: "#4A494E", // Slightly lighter shade when items are selected
          color: "#FFFFFF",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="h6" sx={{ color: "#FFFFFF" }}>
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl sx={{ minWidth: 200, mr: 4 }}>
            <InputLabel sx={{ color: "#FFFFFF", "&.Mui-focused": { color: "#FFFFFF" } }}>
              Filter
            </InputLabel>
            <Select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              label="Filter"
              fullWidth
              sx={{
                height: 60,
                fontSize: "1.1rem",
                color: "#FFFFFF",
                "& .MuiSvgIcon-root": { color: "#FFFFFF" }, // Dropdown arrow
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#FFFFFF" }, // White border
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FFFFFF" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FFFFFF" },
              }}
            >
              {filterOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ fontSize: "1.1rem", color: "#000000" }} // Black text for dropdown items for readability
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={24} icon="eva:search-fill" sx={{ color: "#FFFFFF" }} />
              </InputAdornment>
            }
            sx={{
              maxWidth: 400,
              height: 50,
              fontSize: "1.1rem",
              color: "#FFFFFF",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#FFFFFF" }, // White border
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#FFFFFF" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FFFFFF" },
            }}
          />
        </Box>
      )}
 
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            onClick={onDeleteSelected}
            sx={{
              color: "#FF0000", // Keep delete icon red for visibility
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={28} />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
}