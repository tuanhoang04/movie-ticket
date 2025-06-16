import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "../utils";
 
export function MovieTableHead({
    numSelected,
    rowCount,
    onSelectAllRows,
    headLabel,
    orderBy,
    order,
    onSort
}) {
    return (
        <TableHead sx={{ bgcolor: "#323137" }}>
            <TableRow>
                <TableCell
                    padding="checkbox"
                    sx={{
                        borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
                    }}
                >
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={(event) => onSelectAllRows(event.target.checked)}
                        sx={{
                            color: "#FFFFFF",
                            "&.Mui-checked": { color: "#FFFFFF" },
                        }}
                    />
                </TableCell>
 
                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align || 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{
                            fontSize: "1.25rem",
                            width: headCell.width,
                            minWidth: headCell.minWidth,
                            color: "#FFFFFF",
                            borderBottom: "0.5px solid rgba(255, 255, 255, 0.3)", // Thinner, less opaque border
                        }}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => onSort(headCell.id)}
                            sx={{
                                color: "#FFFFFF",
                                "&:hover": { color: "#FFFFFF" },
                                "&.Mui-active": { color: "#FFFFFF" },
                                "& .MuiTableSortLabel-icon": { color: "#FFFFFF !important" },
                            }}
                        >
                            {headCell.label}
 
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc' ? 'sorted descending' : 'sort ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}