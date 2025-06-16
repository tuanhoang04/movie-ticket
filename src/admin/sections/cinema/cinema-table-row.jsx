import {
  Box,
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
  Snackbar,
  Alert,
} from "@mui/material";
import { useCallback, useState } from "react";
import { Iconify } from "../../components/iconify";
import { Link, useNavigate } from "react-router-dom";

const deleteCinema = async (id) => {
  try {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/cinemas/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + jwt,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete cinema");
    }

    return true;
  } catch (error) {
    console.error("Error deleting cinema:", error);

    return false;
  }
};

function getBadgeStyle(clusterName) {
  switch (clusterName) {
    case "CGV Cinemas":
      return { backgroundColor: "#2196f3", color: "#fff" }; // Blue
    case "Beta Cinemas":
      return { backgroundColor: "#f50057", color: "#fff" }; // Pink
    case "Lotte Cinemas":
      return { backgroundColor: "#4caf50", color: "#fff" }; // Green
    case "Cinestar":
      return { backgroundColor: "#ff5722", color: "#fff" }; // Orange
    case "Mega GS Cinemas":
      return { backgroundColor: "#ffc107", color: "#000" }; // Yellow
    case "Dcine":
      return { backgroundColor: "#9c27b0", color: "#fff" }; // Purple
    case "Đống Đa Cinema":
      return { backgroundColor: "#795548", color: "#fff" }; // Brown
    case "Starlight":
      return { backgroundColor: "#00bcd4", color: "#fff" }; // Cyan
    case "Rio Cinemas":
      return { backgroundColor: "#8bc34a", color: "#fff" }; // Light Green
    case "Touch Cinema":
      return { backgroundColor: "#ff9800", color: "#fff" }; // Deep Orange
    case "Cinemax":
      return { backgroundColor: "#607d8b", color: "#fff" }; // Blue Gray
    default:
      return { backgroundColor: "#e0e0e0", color: "#000" }; // Gray for unknown clusters
  }
}

export function CinemaTableRow({ row, selected, onSelectRow, onDelete }) {
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
    navigate(`/admin/cinema/${row.cinema_id}`);
  };

  const handleDeleteButton = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteCinema(row.cinema_id);
    if (success) {
      onDelete(row.cinema_id);
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
            to={`/admin/cinema/${row.cinema_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              noWrap
              sx={{
                fontSize: { xs: "1.1rem", md: "1.2rem" },
                color: "#FFFFFF",
              }}
            >
              {row.cinema_name}
            </Typography>
          </Link>
        </TableCell>

        <CinemaAddressCell row={row} />

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Box
            component="span"
            sx={{
              ...getBadgeStyle(row.cluster_name),
              padding: "2px 8px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", md: "1rem" },
              display: "inline-block",
            }}
          >
            {row.cluster_name}
          </Box>
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
              <Iconify
                icon="solar:trash-bin-trash-bold"
                sx={{ color: "#FF0000" }}
              />
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
            Are you sure you want to delete the cinema{" "}
            <strong>{row.cinema_name}</strong> ?
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

export function CinemaAddressCell({ row }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <TableCell
      sx={{
        color: "#FFFFFF",
        borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
      }}
    >
      <Tooltip title={row.address} placement="top" arrow>
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
          {row.address}
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
        <DialogTitle sx={{ color: "#FFFFFF" }}>Address</DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {row.address}
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
