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
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <Link
            to={`/admin/order/${row.order_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              noWrap
              sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
            >
              {row.order_id}
            </Typography>
          </Link>
        </TableCell>

        <TableCell>
          <Link
            to={`/admin/user/${row.user_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              noWrap
              sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
            >
              {row.username}
            </Typography>
          </Link>
        </TableCell>

        <TableCell>
          <Typography
            variant="body1"
            fontWeight="bold"
            noWrap
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            {row.film_name}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body1"
            fontWeight="medium"
            noWrap
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            {row.cinema_name}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body1"
            fontWeight="medium"
            noWrap
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            {row.room_name}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body1"
            fontWeight="medium"
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            {new Date(row.show_date).toLocaleDateString()}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body1"
            fontWeight="medium"
            noWrap
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.total_price)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body1"
            fontWeight="medium"
            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
          >
            {new Date(row.order_date).toLocaleDateString()}
          </Typography>
        </TableCell>

        <TableCell>
          <IconButton
            onClick={handleDeleteButton}
            sx={{
              color: "error.main",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete conformation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the order?
            <strong>{row.order_id}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="warning">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
