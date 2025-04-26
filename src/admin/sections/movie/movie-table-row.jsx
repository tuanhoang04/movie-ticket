import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
  Table,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { Iconify } from "../../components/iconify";
import { Link, useNavigate } from "react-router-dom";

const deleteMovie = async (id) => {
  try {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/films/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        // credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }

    return true;
  } catch (error) {
    console.error("Error deleting movie:", error);
    return false;
  }
};

export function MovieTableRow({ row, selected, onSelectRow, onDelete }) {
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
    navigate(`/admin/movie/${row.film_id}`);
  };

  const handleDeleteButton = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteMovie(row.film_id);
    if (success) {
      onDelete(row.film_id);
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
            to={`/admin/movie/${row.film_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="body2" fontWeight="bold" noWrap>
              {row.film_name}
            </Typography>
          </Link>
        </TableCell>

        <MovieDescriptionCell row={row} />

        <TableCell>
          <Chip
            variant="body2"
            label={row.film_type === 1 ? "Now showing" : "Upcoming"}
            color={row.film_type === 1 ? "primary" : "secondary"}
            // label={
            //     row.film_type === 2
            //         ? 'Sắp chiếu'
            //         : row.film_type === 1
            //             ? 'Đang chiếu'
            //             : row.film_type === 0
            //                 ? 'Ngừng chiếu' : 'Không xác định'
            // }
            // color={
            //     row.film_type === 0
            //         ? 'default'
            //         : row.film_type === 1
            //             ? 'primary'
            //             : row.film_type === 2
            //                 ? 'secondary' : 'default'
            // }
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </TableCell>

        <TableCell>
          <Typography
            variant="body2"
            sx={{
              fontWeight: "medium",
              textAlign: "center",
              color: row.age_limit >= 18 ? "error.main" : "text.primary",
            }}
          >
            {row.age_limit}+
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", fontWeight: "medium" }}
          >
            {row.duration} (min)
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", fontWeight: "medium" }}
          >
            {new Date(row.Release_date).toLocaleDateString()}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
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
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this movie?{" "}
            <strong>{row.film_name}</strong>
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
    </>
  );
}

export function MovieDescriptionCell({ row }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <TableCell>
      <Tooltip title={row.film_describe} placement="top" arrow>
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            color: "primary.main",
            display: "inline-block",
            maxWidth: 200,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          onClick={openDialog}
        >
          {row.film_describe}
        </Typography>
      </Tooltip>

      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Detail description</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{row.film_describe}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </TableCell>
  );
}
