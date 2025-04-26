/**
 * UserTableHead Component
 * 
 * This component renders the header row for the user table, including column headers,
 * a select-all checkbox, and sortable labels for each column.
 * 
 * @param {number} numSelected - The number of currently selected rows.
 * @param {number} rowCount - The total number of rows in the table.
 * @param {Function} onSelectAllRows - Handler for selecting or deselecting all rows.
 * @param {Array} headLabel - Array of objects representing each column's properties.
 * @param {string} orderBy - ID of the column currently being sorted.
 * @param {string} order - Current sorting order, either 'asc' or 'desc'.
 * @param {Function} onSort - Handler for sorting the table by a specific column.
 * 
 * @returns {JSX.Element} The rendered table header, including the "Select All" checkbox and sortable column headers.
 */

import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "../utils";

export function UserTableHead({
    numSelected,
    rowCount,
    onSelectAllRows,
    headLabel,
    orderBy,
    order,
    onSort
}) {
    return (
        <TableHead>
            <TableRow>
                {/* Checkbox for selecting/deselecting all rows */}
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount} // Partial selection
                        checked={rowCount > 0 && numSelected === rowCount} // All selected if true
                        onChange={(event) => onSelectAllRows(event.target.checked)}
                    />
                </TableCell>

                {/* Render each column header with optional sorting */}
                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id} // Unique key for each column header
                        align={headCell.align || 'left'} // Align left by default
                        sortDirection={orderBy === headCell.id ? order : false} // Set sorting direction if applicable
                        sx={{ fontSize:"1.2rem",width: headCell.width, minWidth: headCell.minWidth }} // Custom width styles
                    >
                        {/* Sortable label for column, clickable to sort */}
                        <TableSortLabel
                            hideSortIcon // Hide default sort icon until active
                            active={orderBy === headCell.id} // Show active state if column is sorted
                            direction={orderBy === headCell.id ? order : 'asc'} // Set sort direction
                            onClick={() => onSort(headCell.id)} // Call onSort with column ID on click
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
    );
}
