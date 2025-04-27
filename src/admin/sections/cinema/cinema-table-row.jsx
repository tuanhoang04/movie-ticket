import { Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, menuItemClasses, MenuList, Popover, Table, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { Iconify } from '../../components/iconify'
import { Link, useNavigate } from "react-router-dom";

const deleteCinema = async (id) => {
    try {
        const jwt = localStorage.getItem('jwt');

        if (!jwt) {
            console.error('JWT token is missing');
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/cinemas/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + jwt,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete cinema');
        }

        return true;
    } catch (error) {
        console.error("Error deleting cinema:", error);
        return false;
    }
};

function getBadgeStyle(clusterName) {
    switch (clusterName) {
        case 'CGV Cinemas':
            return { backgroundColor: '#2196f3', color: '#fff' }; // Blue
        case 'Beta Cinemas':
            return { backgroundColor: '#f50057', color: '#fff' }; // Pink
        case 'Lotte Cinemas':
            return { backgroundColor: '#4caf50', color: '#fff' }; // Green
        case 'Cinestar':
            return { backgroundColor: '#ff5722', color: '#fff' }; // Orange
        case 'Mega GS Cinemas':
            return { backgroundColor: '#ffc107', color: '#000' }; // Yellow
        case 'Dcine':
            return { backgroundColor: '#9c27b0', color: '#fff' }; // Purple
        case 'Đống Đa Cinema':
            return { backgroundColor: '#795548', color: '#fff' }; // Brown
        case 'Starlight':
            return { backgroundColor: '#00bcd4', color: '#fff' }; // Cyan
        case 'Rio Cinemas':
            return { backgroundColor: '#8bc34a', color: '#fff' }; // Light Green
        case 'Touch Cinema':
            return { backgroundColor: '#ff9800', color: '#fff' }; // Deep Orange
        case 'Cinemax':
            return { backgroundColor: '#607d8b', color: '#fff' }; // Blue Gray
        default:
            return { backgroundColor: '#e0e0e0', color: '#000' }; // Gray for unknown clusters
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
    }

    const handleDeleteButton = () => {
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleConfirmDelete = async () => {
        const success = await deleteCinema(row.cinema_id);
        if (success) {
            onDelete(row.cinema_id);
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
                        to={`/admin/cinema/${row.cinema_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            noWrap
                            sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                        >
                            {row.cinema_name}
                        </Typography>
                    </Link>
                </TableCell>

                <CinemaAddressCell row={row} />

                <TableCell>
                    <Box
                        component="span"
                        sx={{
                            ...getBadgeStyle(row.cluster_name),
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            display: 'inline-block',
                        }}
                    >
                        {row.cluster_name}
                    </Box>
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
                        Bạn có chắc chắn muốn xóa rạp chiếu <strong>{row.cinema_name}</strong> không?
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

export function CinemaAddressCell({ row }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    return (
        <TableCell>
            <Tooltip title={row.address} placement="top" arrow>
                <Typography
                    variant="body1"
                    sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        display: 'inline-block',
                        maxWidth: 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: { xs: "1.1rem", md: "1.3rem" }, // Tăng font size cho cột Address
                        "&:hover": {
                            fontSize: { xs: "1.1rem", md: "1.3rem" }, // Đảm bảo font size không thay đổi khi hover
                        },
                    }}
                    onClick={openDialog}
                >
                    {row.address}
                </Typography>
            </Tooltip>

            <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Địa chỉ</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}>
                        {row.address}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </TableCell>
    );
}