import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Popover,
  Table,
  TableCell,
  TableRow,
  Typography,
  TextField,
  MenuList,
  menuItemClasses,
  Snackbar,
  Alert,
} from "@mui/material";
import { useCallback, useState, useEffect } from "react";
import { Iconify } from "../../components/iconify";
import { Link } from "react-router-dom";

// delete room api
const deleteRoom = async (id) => {
  try {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/rooms/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + jwt,
        },
        // credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete room");
    }

    return true;
  } catch (error) {
    console.error("Error deleting room:", error);
    return false;
  }
};

// room details api
const fetchRoomDetails = async (roomId) => {
  try {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/rooms/detail/${roomId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwt,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch room details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching room details:", error);
    return null;
  }
};

// edit room api
const editRoom = async (roomId, roomName, cinemaName) => {
  try {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/rooms/edit/${roomId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify({ room_name: roomName, cinema_name: cinemaName }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to edit room");
    }

    return true;
  } catch (error) {
    console.error("Error editing room:", error);
    return false;
  }
};
export function RoomTableRow({
  row,
  selected,
  onSelectRow,
  onDelete,
  onEditSuccess,
}) {
  const [openPopover, setOpenPopover] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [cinemaName, setCinemaName] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleDeleteButton = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditClick = async () => {
    setLoading(true);
    const roomDetails = await fetchRoomDetails(row.room_id);
    if (roomDetails) {
      setRoomName(roomDetails.room[0].room_name);
      setCinemaName(roomDetails.cinema[0].cinema_name);
    }
    setLoading(false);
    setOpenEditDialog(true);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteRoom(row.room_id);
    if (success) {
      onDelete(row.room_id);
    }
    setOpenDialog(false);
  };

  const handleSubmitEdit = async () => {
    const success = await editRoom(row.room_id, roomName, cinemaName);

    if (success && onEditSuccess) {
      setSnackbar({
        open: true,
        message: "Update room successfully",
        severity: "success",
      });
      onEditSuccess(row.room_id, {
        room_name: roomName,
        cinema_name: cinemaName,
      });
    } else {
      setSnackbar({
        open: false,
        message: "Update room failed.Try again!",
        severity: "error",
      });
    }

    setOpenEditDialog(false);
    setOpenPopover(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <Typography variant="body1" fontWeight="bold" noWrap>
            <Link onClick={handleEditClick} sx={{ cursor: "pointer" }}>
              {row.room_name}
            </Link>
          </Typography>
        </TableCell>

        <TableCell>
          <Link
            to={`/admin/cinema/${row.cinema_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="body1" fontWeight="medium" noWrap>
              {row.cinema_name}
            </Typography>
          </Link>
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
            <MenuItem onClick={handleEditClick} sx={{ color: "primary.main" }}>
              <Iconify icon="solar:pen-bold" />
              Chỉnh sửa
            </MenuItem>
            <MenuItem onClick={handleDeleteButton} sx={{ color: "error.main" }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Xóa
            </MenuItem>
          </MenuList>
        </Popover>
      </TableRow>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle sx={{ fontSize: "24px" }}>
          {loading ? "Loading data..." : "Edit room"}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography variant="body1">Loading data...</Typography>
          ) : (
            <>
              <TextField
                label="Room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                fullWidth
                sx={{ mb: 2, mt: 2 }}
                slotProps={{
                  input: {
                    style: { fontSize: "20px" }, // Chỉnh kích thước chữ trong input
                  },
                  inputLabel: { style: { fontSize: "20px" } },
                }}
              />
              <TextField
                label="Cinema name"
                value={cinemaName}
                onChange={(e) => setCinemaName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    style: { fontSize: "20px" },
                  },
                  inputLabel: { style: { fontSize: "20px" } },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitEdit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the room{" "}
            <strong>{row.room_name}</strong> of{" "}
            <strong>{row.cinema_name}</strong>?
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
