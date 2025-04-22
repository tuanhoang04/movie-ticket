import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, menuItemClasses, MenuList, Popover, Table, TableCell, TableRow, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { Iconify } from '../../components/iconify'
import { Link, useNavigate } from "react-router-dom";

const deleteShowtime = async (id) => {
    try {
        const jwt = localStorage.getItem('jwt');

        if (!jwt) {
            console.error('JWT token is missing');
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/showtimes/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + jwt,
            },
            // credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete showtime');
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

    const handleOpenPopover = useCallback((event) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const navigate = useNavigate();
    const handleEditButton = () => {
        navigate(`/admin/showtime/${row.showtime_id}`);
    }

    const handleDeleteButton = () => {
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleConfirmDelete = async () => {
        const success = await deleteShowtime(row.showtime_id);
        if (success) {
            onDelete(row.showtime_id);
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
                        to={`/admin/showtime/${row.showtime_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body2" fontWeight="bold" noWrap>
                            {row.showtime_id}
                        </Typography>
                    </Link>
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

                <TableCell>
                    <Link
                        to={`/admin/cinema/${row.cinema_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body2" fontWeight='medium' noWrap>
                            {row.cinema_name}
                        </Typography>
                    </Link>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" fontWeight='medium' noWrap>
                        {row.room_name}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" textAlign='center' fontWeight='medium' >
                        {row.show_time.split(':').slice(0, 2).join(':')}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" textAlign='center' fontWeight='medium' >
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
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuList
                        disablePadding
                        sx={{
                            p: 0.5,
                            gap: 0.5,
                            width: 140,
                            display: 'flex',
                            flexDirection: 'column',
                            [`& .${menuItemClasses.root}`]: {
                                px: 1,
                                gap: 2,
                                borderRadius: 0.75,
                                [`&. ${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                            },
                        }}
                    >
                        <MenuItem onClick={handleEditButton} sx={{ color: 'primary.main' }}>
                            <Iconify icon="solar:pen-bold" />
                            Chỉnh sửa
                        </MenuItem>
                        <MenuItem onClick={handleDeleteButton} sx={{ color: 'error.main' }}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                            Xóa
                        </MenuItem>
                    </MenuList>
                </Popover>
            </TableRow>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa suất chiếu <strong>{row.showtime_id}</strong> không?
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
    )
}