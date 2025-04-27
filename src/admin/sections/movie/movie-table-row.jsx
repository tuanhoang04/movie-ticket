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

export function MovieTableRow({ row, selected, onSelectRow, onDelete, sx }) {
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
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        sx={{
          ...sx,
          bgcolor: "#323137",
          "&:hover": { bgcolor: "#4A494E" },
          borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
        }}
      >
        <TableCell
          padding="checkbox"
          sx={{
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
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
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
          }}
        >
          <Link
            to={`/admin/movie/${row.film_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              noWrap
              sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
            >
              {row.film_name}
            </Typography>
          </Link>
        </TableCell>

        <MovieDescriptionCell row={row} />

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
          }}
        >
          <Chip
            label={row.film_type === 1 ? "Now showing" : "Upcoming"}
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", md: "1rem" },
              bgcolor: row.film_type === 1 ? "#1976D2" : "#AB47BC",
              color: "#FFFFFF",
            }}
          />
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: "medium",
              textAlign: "center",
              color: row.age_limit >= 18 ? "#FF0000" : "#FFFFFF",
              fontSize: { xs: "1.1rem", md: "1.2rem" },
            }}
          >
            {row.age_limit}+
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
          }}
        >
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              fontWeight: "medium",
              fontSize: { xs: "1.1rem", md: "1.2rem" },
              color: "#FFFFFF",
            }}
          >
            {row.duration} (min)
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              fontWeight: "medium",
              fontSize: { xs: "1.1rem", md: "1.2rem" },
              color: "#FFFFFF",
            }}
          >
            {new Date(row.Release_date).toLocaleDateString()}
          </Typography>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
          }}
        >
          <IconButton onClick={handleOpenPopover}>
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
        <DialogTitle sx={{ color: "#FFFFFF" }}>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#FFFFFF" }}>
            Are you sure you want to delete this movie?{" "}
            <strong>{row.film_name}</strong>
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

export function MovieDescriptionCell({ row }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <TableCell
      sx={{
        color: "#FFFFFF",
        borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
      }}
    >
      <Tooltip title={row.film_describe} placement="top" arrow>
        <Typography
          variant="body1"
          sx={{
            cursor: "pointer",
            color: "#1976D2",
            display: "inline-block",
            maxWidth: 200,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            "&:hover": {
              fontSize: { xs: "1.1rem", md: "1.3rem" },
            },
          }}
          onClick={openDialog}
        >
          {row.film_describe}
        </Typography>
      </Tooltip>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            bgcolor: "#323137",
            color: "#FFFFFF",
            borderColor: "#FFFFFF",
          },
        }}
      >
        <DialogTitle sx={{ color: "#FFFFFF" }}>Detail description</DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {row.film_describe}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDialog}
            sx={{ color: "#1976D2", "&:hover": { bgcolor: "#4A494E" } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </TableCell>
  );
}