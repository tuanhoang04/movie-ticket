import {
  Avatar,
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
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { Label } from "../../components/label";
import { Iconify } from "../../components/iconify";
import { Link, useNavigate } from "react-router-dom";

const deleteUser = async (id) => {
  try {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + jwt,
        },
        // credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);

    return false;
  }
};

export function UserTableRow({ row, selected, onSelectRow }) {
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
    navigate(`/admin/user/${row.user_id}`);
  };

  const handleDeleteButton = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteUser(row.user_id);
    if (success) {
      onDelete(row.user_id);
    }
    setOpenDialog(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.username} src={row.user_img} />
            <Link
              to={`/admin/user/${row.user_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="body2" fontWeight="bold" noWrap>
                {row.username}
              </Typography>
            </Link>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {row.email}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {row.phone_number}
          </Typography>
        </TableCell>

        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <Iconify
              icon={row.role === 1 ? "mdi:shield-account" : "mdi:account"}
              color={row.role === 1 ? "primary.main" : "success.main"}
              width={20}
              height={20}
            />
            <Chip
              label={
                row.role === 0 ? "User" : row.role === 1 ? "Admin" : "Undefined"
              }
              size="small"
              sx={{
                color:
                  row.role === 1
                    ? "primary.contrastText"
                    : "success.contrastText",
                backgroundColor:
                  row.role === 1 ? "primary.main" : "success.main",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            />
          </Box>
        </TableCell>

        <TableCell>
          <Label color={(row.status === 0 && "error") || "success"}>
            {row.status === 0 ? "Inactive" : "Active"}
          </Label>
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
            <MenuItem onClick={handleEditButton}>
              <Iconify icon="solar:pen-bold" sx={{ color: "primary.main" }} />
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
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng <strong>{row.username}</strong>{" "}
            không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
