import { Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { Iconify } from '../../components/iconify'
import { Link, useNavigate } from "react-router-dom";

// click order_id to open order details
const deleteOrder = async (id) => {
    try {
        const jwt = localStorage.getItem('jwt');

        if (!jwt) {
            console.error('JWT token is missing');
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + jwt,
            },
            // credentials: 'include',

        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }

        return true;
    } catch (error) {
        console.error("Error deleting order:", error);
        return false;
    }
}

export function OrderTableRow({ row, selected, onSelectRow, onDelete }) {
    const [openDialog, setOpenDialog] = useState(false);

    const handleDeleteButton = () => {
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleConfirmDelete = async () => {
        const success = await deleteOrder(row.order_id);
        if (success) {
            onDelete(row.order_id);
        }
        setOpenDialog(false);
    }

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
                        <Typography variant="body2" fontWeight="bold" noWrap>
                            {row.order_id}
                        </Typography>
                    </Link>
                </TableCell>

                <TableCell>
                    <Link
                        to={`/admin/user/${row.user_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body2" fontWeight="bold" noWrap>
                            {row.username}
                        </Typography>
                    </Link>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" fontWeight="bold" noWrap>
                        {row.film_name}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                        {row.cinema_name}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                        {row.room_name}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {new Date(row.show_date).toLocaleDateString()}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.total_price)}
                    </Typography>
                </TableCell>


                <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {new Date(row.order_date).toLocaleDateString()}
                    </Typography>
                </TableCell>

                <TableCell>
                    <IconButton
                        onClick={handleDeleteButton}
                        sx={{
                            color: 'error.main',
                            '&:hover': { backgroundColor: 'action.hover' },
                        }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa đơn hàng <strong>{row.order_id}</strong> không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} color="warning">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}