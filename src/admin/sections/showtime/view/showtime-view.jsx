import { useState, useEffect, useMemo } from "react";
import { hook } from "../hook";
import { applyFilter, getComparator } from "../../utils";
import { DashboardContent } from "../../../layouts/dashboard";
import {
  Box,
  Button,
  Card,
  Table,
  TableRow,
  TableCell,
  CircularProgress,
  TableContainer,
  TablePagination,
  Typography,
  Snackbar,
  TableBody,
  Alert,
} from "@mui/material";
import { ShowtimeTableToolbar } from "../showtime-table-toolbar";
import { Scrollbar } from "../../../components/scrollbar";
import { ShowtimeTableHead } from "../showtime-table-head";
import { ShowtimeTableRow } from "../showtime-table-row";
import { Iconify } from "../../../components/iconify";
import { TableNoData } from "../../table-no-data";
import { Link } from "react-router-dom";

export function ShowtimeView() {
  const table = hook();
  const [filterName, setFilterName] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("film_name");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
    table.onResetPage();
  };

  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter);
  };

  const handleDeleteSelected = async () => {
    if (table.selected.length === 0) return;

    try {
      const jwt = localStorage.getItem("jwt");

      if (!jwt) {
        console.error("JWT token is missing");
        return;
      }

      for (const showtimeId of table.selected) {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/showtimes/delete/${showtimeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete showtime with ID: ${showtimeId}`);
        }
      }
      setSnackbar({
        open: true,
        message: "Delete showtime successfully",
        severity: "success",
      });
      setShowtimes((prevShowtimes) =>
        prevShowtimes.filter(
          (showtime) => !table.selected.includes(showtime.showtime_id)
        )
      );
      table.setSelected([]);
      console.log("Selected showtimes deleted successfully.");
    } catch (error) {
      console.error("Error deleting selected showtimes:", error);
    }
  };

  useEffect(() => {
    const fetchShowtimes = async () => {
      setLoading(true);
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/showtimes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch showtimes");

        const data = await response.json();
        setShowtimes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  const filteredData = useMemo(() => {
    return applyFilter({
      inputData: showtimes,
      comparator: getComparator(table.order, table.orderBy),
      filterName,
      attribute: selectedFilter,
    });
  }, [showtimes, table.order, table.orderBy, filterName, selectedFilter]);

  useEffect(() => {
    setDataFiltered(filteredData);
  }, [filteredData]);

  const notFound = !dataFiltered.length && filterName;

  return (
    <DashboardContent>
      <Box
        display="flex"
        mb={5}
        sx={{
          width: "100%",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            flexGrow: 1,
            marginBottom: { xs: 1 },
            color: "white",
            fontWeight: "bold",
          }}
        >
          Showtimes Management
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<Iconify icon="mingcute:add-line" />}
          component={Link}
          to="/admin/showtime/create"
          sx={{ fontSize: "1.1rem" }}
        >
          Add Showtime
        </Button>
      </Box>

      <Card>
        <ShowtimeTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          selectedFilter={selectedFilter}
          onFilterName={handleFilterName}
          onFilterChange={handleFilterChange}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <ShowtimeTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => {
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((showtime) => showtime.showtime_id)
                  );
                }}
                headLabel={[
                  { id: "showtime_id", label: "Showtime ID" },
                  { id: "film_name", label: "Film name" },
                  { id: "cinema_name", label: "Cinema name" },
                  { id: "room_name", label: "Room name" },
                  { id: "show_time", label: "Show time" },
                  { id: "show_date", label: "show date" },
                  { id: "" },
                ]}
              />

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="150px"
                      >
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ShowtimeTableRow
                      key={row.showtime_id}
                      row={row}
                      selected={table.selected.includes(row.showtime_id)}
                      onSelectRow={() => table.onSelectRow(row.showtime_id)}
                      onDelete={(id) => {
                        setSnackbar({
                          open: true,
                          message: "Delete showtime successfully",
                          severity: "success",
                        });
                        setShowtimes((prevShowtimes) =>
                          prevShowtimes.filter(
                            (showtime) => showtime.showtime_id !== id
                          )
                        );
                        table.setSelected((prevSelected) =>
                          prevSelected.filter((selectedId) => selectedId !== id)
                        );
                      }}
                    />
                  ))}

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {dataFiltered.length > 0 && (
          <TablePagination
            sx={{
              "& *": {
                fontSize: "1.25rem",
              },
            }}
            component="div"
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
          />
        )}
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          sx={{ width: "100%", fontSize: "1.25rem" }}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
