import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Iconify } from "../../components/iconify";
import { Link } from "react-router-dom";

// click order_id to open order details
const deleteOrder = async (id) => {
  try {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("JWT token is missing");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + jwt,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete order");
    }

    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    return false;
  }
};

export function OrderTableRow({ row, selected, onSelectRow, onDelete }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteButton = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteOrder(row.order_id);
    if (success) {
      onDelete(row.order_id);
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
            to={`/admin/order/${row.order_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              noWrap
              sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#1976D2" }}
            >
              {row.order_id}
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
        </TableCell>

        <TableCell
          sx={{
            color: "#FFFFFF",
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            noWrap
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {row.film_name}
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
            {row.cinema_name}
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
            variant="body1"
            fontWeight="medium"
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {new Date(row.show_date).toLocaleDateString()}
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
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.total_price)}
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
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, color: "#FFFFFF" }}
          >
            {new Date(row.order_date).toLocaleDateString()}
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <IconButton
            onClick={handleDeleteButton}
            sx={{
              color: "#FF0000",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
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
            Are you sure you want to delete the order?
            <strong>{row.order_id}</strong>
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