import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { Iconify } from "../../components/iconify";
import { Link, useNavigate } from "react-router-dom";

const deleteShowtime = async (id) => {
  try {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/showtimes/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + jwt,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete showtime");
    }

    return true;
  } catch (error) {
    console.error("Error deleting showtime:", error);

    return false;
  }
};

export function ShowtimeTableRow({ row, selected, onSelectRow, onDelete }) {
  const [openPopover, setOpenPopover] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const navigate = useNavigate();
  const handleEditButton = () => {
    navigate(`/admin/showtime/${row.showtime_id}`);
  };

  const handleDeleteButton = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteShowtime(row.showtime_id);
    if (success) {
      onDelete(row.showtime_id);
    }
    setOpenDialog(false);
  };

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        sx={{
          bgcolor: "#323137",
          "&:hover": { bgcolor: "#4A494E" },
          borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <TableCell
          padding="checkbox"
          sx={{
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Checkbox
            disableRipple
            checked={selected}
            onChange={onSelectRow}
            sx={{
              color: "#FFFFFF",
              "&.Mui-checked": { color: "#FFFFFF" },
            }}
          />
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Link
            to={`/admin/showtime/${row.showtime_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              noWrap
              sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
            >
              {row.showtime_id}
            </Typography>
          </Link>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Link
            to={`/admin/movie/${row.film_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              noWrap
              sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
            >
              {row.film_name}
            </Typography>
          </Link>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Link
            to={`/admin/cinema/${row.cinema_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="body2"
              fontWeight="medium"
              noWrap
              sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
            >
              {row.cinema_name}
            </Typography>
          </Link>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography
            variant="body2"
            fontWeight="medium"
            noWrap
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {row.room_name}
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography
            variant="body2"
            textAlign="center"
            fontWeight="medium"
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {row.show_time.split(":").slice(0, 2).join(":")}
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography
            variant="body2"
            textAlign="center"
            fontWeight="medium"
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {new Date(row.show_date).toLocaleDateString()}
          </Typography>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <IconButton onClick={handleOpenPopover} size="small">
            <Iconify icon="eva:more-vertical-fill" sx={{ color: "#FFFFFF" }} />
          </IconButton>
        </TableCell>

        <Popover
          open={Boolean(openPopover)}
          anchorEl={openPopover}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuList
            disablePadding
            sx={{
              p: 0.5,
              gap: 0.5,
              width: 140,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#323137",
              color: "#FFFFFF",
              [`& .${menuItemClasses.root}`]: {
                px: 1,
                gap: 2,
                borderRadius: 0.75,
                color: "#FFFFFF",
                [`&. ${menuItemClasses.selected}`]: {
                  bgcolor: "#4A494E",
                },
              },
            }}
          >
            <MenuItem onClick={handleEditButton} sx={{ color: "#1976D2" }}>
              <Iconify icon="solar:pen-bold" sx={{ color: "#1976D2" }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteButton} sx={{ color: "#FF0000" }}>
              <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: "#FF0000" }} />
              Delete
            </MenuItem>
          </MenuList>
        </Popover>
      </TableRow>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: "#323137",
            color: "#FFFFFF",
            borderColor: "#FFFFFF",
          },
        }}
      >
        <DialogTitle sx={{ color: "#FFFFFF" }}>Delete confirmation</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#FFFFFF" }}>
            Are you sure you want to delete the showtime{" "}
            <strong>{row.showtime_id}</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: "#1976D2", "&:hover": { bgcolor: "#4A494E" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{ color: "#FF0000", "&:hover": { bgcolor: "#4A494E" } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}