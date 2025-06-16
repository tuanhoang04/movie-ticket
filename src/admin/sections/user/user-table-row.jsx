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

export function UserTableRow({ row, selected, onSelectRow, onDelete }) {
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
          component="th"
          scope="row"
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.username} src={row.user_img} />
            <Link
              to={`/admin/user/${row.user_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#1976D2" }}
              >
                {row.username}
              </Typography>
            </Link>
          </Box>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography
            variant="body1"
            fontWeight="medium"
            noWrap
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {row.email}
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography
            variant="body1"
            fontWeight="medium"
            noWrap
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {row.phone_number}
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Iconify
              icon={row.role === 1 ? "mdi:shield-account" : "mdi:account"}
              color={row.role === 1 ? "#1976D2" : "#4CAF50"}
              width={25}
              height={25}
            />
            <Chip
              label={
                row.role === 0 ? "User" : row.role === 1 ? "Admin" : "Undefined"
              }
              size="small"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.2rem" },
                color: "#FFFFFF",
                backgroundColor: row.role === 1 ? "#1976D2" : "#4CAF50",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            />
          </Box>
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Label
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
            color={(row.status === 0 && "error") || "success"}
          >
            {row.status === 0 ? "Inactive" : "Active"}
          </Label>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
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
        <DialogTitle sx={{ color: "#FFFFFF" }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#FFFFFF" }}>
            Bạn có chắc chắn muốn xóa người dùng <strong>{row.username}</strong>{" "}
            không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: "#1976D2", "&:hover": { bgcolor: "#4A494E" } }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{ color: "#FF0000", "&:hover": { bgcolor: "#4A494E" } }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}