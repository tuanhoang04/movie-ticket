import { useEffect, useMemo, useState } from "react";
import { hook } from "../hook";
import { applyFilter, getComparator } from "../../utils";
import { DashboardContent } from "../../../layouts/dashboard";
import {
  Card,
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { CinemaTableToolbar } from "../cinema-table-toolbar";
import { Scrollbar } from "../../../components/scrollbar";
import { CinemaTableHead } from "../cinema-table-head";
import { TableNoData } from "../../table-no-data";
import { CinemaTableRow } from "../cinema-table-row";
import { Link } from "react-router-dom";

export function CinemaView() {
  const table = hook();
  const [filterName, setFilterName] = useState("");
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("cinema_name");
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

      for (const cinemaId of table.selected) {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/cinemas/delete/${cinemaId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete cinema with ID: ${cinemaId}`);
        }
      }
      setSnackbar({
        open: true,
        message: "Delete cinema successfully",
        severity: "success",
      });
      setCinemas((prevCinemas) =>
        prevCinemas.filter(
          (cinema) => !table.selected.includes(cinema.cinema_id)
        )
      );
      table.setSelected([]);
      console.log("Selected cinemas deleted successfully.");
    } catch (error) {
      console.error("Error deleting selected cinemas:", error);
    }
  };

  useEffect(() => {
    const fetchCinemas = async () => {
      setLoading(true);
      setError(null);
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/cinemas`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch cinemas");

        const data = await response.json();
        setCinemas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const filteredData = useMemo(() => {
    return applyFilter({
      inputData: cinemas,
      comparator: getComparator(table.order, table.orderBy),
      filterName,
      attribute: selectedFilter,
    });
  }, [cinemas, table.order, table.orderBy, filterName, selectedFilter]);

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
          variant="h3"
          sx={{
            flexGrow: 1,
            marginBottom: { xs: 1 },
            color: "#FFFFFF",
            fontWeight: "bold",
          }}
        >
          Cinemas Management
        </Typography>
        <Button
          sx={{
            fontSize: "1.1rem",
          }}
          variant="contained"
          color="success"
          startIcon={<Iconify icon="mingcute:add-line" />}
          component={Link}
          to="/admin/cinema/create"
        >
          Add Cinema
        </Button>
      </Box>

      <Card
        sx={{
          bgcolor: "#323137",
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
        }}
      >
        <CinemaTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          selectedFilter={selectedFilter}
          onFilterName={handleFilterName}
          onFilterChange={handleFilterChange}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset", bgcolor: "#323137" }}>
            <Table sx={{ minWidth: 800, bgcolor: "#323137" }}>
              <CinemaTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => {
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((cinema) => cinema.cinema_id)
                  );
                }}
                headLabel={[
                  { id: "cinema_name", label: "Cinema Name" },
                  { id: "address", label: "Address" },
                  { id: "cluster_name", label: "Cinema Cluster" },
                  { id: "" },
                ]}
              />

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="150px"
                      >
                        <CircularProgress sx={{ color: "#FFFFFF" }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {error && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="150px"
                      >
                        <Alert severity="error">{error}</Alert>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  !error &&
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <CinemaTableRow
                        key={row.cinema_id}
                        row={row}
                        selected={table.selected.includes(row.cinema_id)}
                        onSelectRow={() => table.onSelectRow(row.cinema_id)}
                        onDelete={(id) => {
                          setSnackbar({
                            open: true,
                            message: "Delete cinema successfully",
                            severity: "success",
                          });
                          setCinemas((prevCinemas) =>
                            prevCinemas.filter(
                              (cinema) => cinema.cinema_id !== id
                            )
                          );
                          table.setSelected((prevSelected) =>
                            prevSelected.filter(
                              (selectedId) => selectedId !== id
                            )
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
                color: "#FFFFFF",
                borderColor: "#FFFFFF",
              },
              "& .MuiTablePagination-selectIcon": {
                color: "#FFFFFF",
              },
              "& .MuiIconButton-root": {
                color: "#FFFFFF",
              },
              bgcolor: "#323137",
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
          sx={{ width: "100%", fontSize: "1.25rem", color: "black" }}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
