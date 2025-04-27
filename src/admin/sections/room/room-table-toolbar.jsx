import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { Iconify } from "../../components/iconify";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export function RoomTableToolbar({
  numSelected,
  filterName,
  selectedFilter,
  onFilterName,
  onFilterChange,
  onDeleteSelected,
}) {
  const filterOptions = [
    { value: "room_name", label: "Room name" },
    { value: "cinema_name", label: "Cinema name" },
  ];

  return (
    <Toolbar
      sx={{
        height: 120, // Increased height to match MovieTableToolbar
        display: "flex",
        justifyContent: "space-between",
        p: (theme) => theme.spacing(0, 2, 0, 4), // Adjusted padding
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="h6"> {/* Larger variant */}
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl sx={{ minWidth: 200, mr: 4 }}> {/* Increased width and margin */}
            <InputLabel sx={{ fontSize: "1.1rem" }}>Filter</InputLabel> {/* Larger font */}
            <Select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              label="Filter"
              fullWidth
              sx={{ height: 60, fontSize: "1.1rem" }} // Increased height and font size
            >
              {filterOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ fontSize: "1.1rem" }} // Larger font for menu items
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
                <Iconify width={24} icon="eva:search-fill" /> {/* Larger icon */}
              </InputAdornment>
            }
            sx={{
              maxWidth: 400, // Slightly wider
              height: 50, // Taller input
              fontSize: "1.1rem", // Larger font
            }}
          />
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            onClick={onDeleteSelected}
            sx={{
              color: "error.main",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={28} /> {/* Larger icon */}
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
}