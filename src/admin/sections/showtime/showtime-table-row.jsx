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
  Snackbar,
  Alert,
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
        // credentials: 'include',
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
      setSnackbar({
        open: true,
        message: "Delete showtime successfully",
        severity: "success",
      });
      setTimeout(() => {
        onDelete(row.showtime_id);
      }, 1000);
    } else {
      setSnackbar({
        open: false,
        message: "Delete showtime failed",
        severity: "eror",
      });
    }
    setOpenDialog(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

                <TableCell>
                    <Link
                        to={`/admin/showtime/${row.showtime_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            noWrap
                            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                        >
                            {row.showtime_id}
                        </Typography>
                    </Link>
                </TableCell>

                <TableCell>
                    <Link
                        to={`/admin/movie/${row.film_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            noWrap
                            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                        >
                            {row.film_name}
                        </Typography>
                    </Link>
                </TableCell>

                <TableCell>
                    <Link
                        to={`/admin/cinema/${row.cinema_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight="medium"
                            noWrap
                            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                        >
                            {row.cinema_name}
                        </Typography>
                    </Link>
                </TableCell>

                <TableCell>
                    <Typography
                        variant="body2"
                        fontWeight="medium"
                        noWrap
                        sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                    >
                        {row.room_name}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography
                        variant="body2"
                        textAlign="center"
                        fontWeight="medium"
                        sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                    >
                        {row.show_time.split(':').slice(0, 2).join(':')}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography
                        variant="body2"
                        textAlign="center"
                        fontWeight="medium"
                        sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                    >
                        {new Date(row.show_date).toLocaleDateString()}
                    </Typography>
                </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover} size="small">
            <Iconify icon="eva:more-vertical-fill" />
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
              [`& .${menuItemClasses.root}`]: {
                px: 1,
                gap: 2,
                borderRadius: 0.75,
                [`&. ${menuItemClasses.selected}`]: {
                  bgcolor: "action.selected",
                },
              },
            }}
          >
            <MenuItem onClick={handleEditButton} sx={{ color: "primary.main" }}>
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteButton} sx={{ color: "error.main" }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </MenuList>
        </Popover>
      </TableRow>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the showtime{" "}
            <strong>{row.showtime_id}</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          sx={{ width: "100%", fontSize: "1.25rem" }}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
