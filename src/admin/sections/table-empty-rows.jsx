/**
 * TableEmptyRows Component
 *
 * This component renders empty rows in the table when there are gaps in the data. 
 * It is used to fill the space when the number of rows displayed is less than the total row count.
 *
 * @param {number} emptyRows - The number of empty rows to display in the table.
 * @param {number} height - The height of each empty row. This will be multiplied by the number of empty rows.
 * @param {Object} sx - Custom styles to be applied to the TableRow.
 * @param {Object} other - Any additional props to be passed to the TableRow.
 *
 * @returns {JSX.Element|null} A TableRow with empty cells if `emptyRows` is greater than 0, 
 * otherwise, returns null.
 */

import { TableRow, TableCell } from "@mui/material";

export function TableEmptyRows({ emptyRows, height, sx, ...other }) {
    if (!emptyRows) {
        return null;
    }

    return (
        <TableRow
            sx={{
                ...(height && {
                    height: height * emptyRows,
                }),
                ...sx,
            }}
            {...other}
        >
            <TableCell colSpan={9} />
        </TableRow>
    );
}
