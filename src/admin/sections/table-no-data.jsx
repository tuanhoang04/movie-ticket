import { Box, TableCell, TableRow, Typography } from "@mui/material";

/**
 * TableNoData Component
 *
 * This component displays a row in the table with a "No data found" message.
 * It is used when no results match the current search query.
 *
 * @param {string} searchQuery - The current search query.
 * @param {Object} other - Additional props to be passed to the TableRow.
 *
 * @returns {JSX.Element} A table row displaying a "No data found" message.
 */
export function TableNoData({ searchQuery, ...other }) {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Not found
          </Typography>

          <Typography variant="body2">
            No results found for&nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br />
            Please check for spelling errors or use complete words.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
