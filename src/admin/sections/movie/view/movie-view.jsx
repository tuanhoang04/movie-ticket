import { DashboardContent } from "../../../layouts/dashboard";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Iconify } from "../../../components/iconify";
import { MovieTableToolbar } from "../movie-table-toolbar";
import { useEffect, useMemo, useState } from "react";
import { hook } from "../hook";
import { applyFilter, emptyRows, getComparator } from "../../utils";
import { MovieTableHead } from "../movie-table-head";
import { MovieTableRow } from "../movie-table-row";
import { TableEmptyRows } from "../../table-empty-rows";
import { TableNoData } from "../../table-no-data";
import { Scrollbar } from "../../../components/scrollbar";
import { Link } from "react-router-dom";

export function MovieView() {
  const table = hook();
  const [filterName, setFilterName] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("film_name");
  const [dataFiltered, setDataFiltered] = useState([]);

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

      for (const movieId of table.selected) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/movies/delete/${movieId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete movie with ID: ${movieId}`);
        }
      }

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => !table.selected.includes(movie.movie_id))
      );
      table.setSelected([]);
      console.log("Selected movies deleted successfully.");
    } catch (error) {
      console.error("Error deleting selected movies:", error);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/films?limitItems=150`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredData = useMemo(() => {
    return applyFilter({
      inputData: movies,
      comparator: getComparator(table.order, table.orderBy),
      filterName,
      attribute: selectedFilter,
    });
  }, [movies, table.order, table.orderBy, filterName, selectedFilter]);

  useEffect(() => {
    setDataFiltered(filteredData);
  }, [filteredData]);

  const notFound = !dataFiltered.length && filterName;

  return (
    <DashboardContent>
      <Box
        display="flex"
        sx={{
          width: "100%",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
        }}
        mb={5}
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
          Movies Management
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<Iconify icon="mingcute:add-line" />}
          component={Link}
          to="/admin/movie/create"
          sx={{ fontSize: "1.1rem" }}
        >
          Add film
        </Button>
      </Box>

      <Card>
        <MovieTableToolbar
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
              <MovieTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => {
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((movie) => movie.film_id)
                  );
                }}
                headLabel={[
                  { id: "film_name", label: "Film name" },
                  { id: "film_describe", label: "Description" },
                  { id: "film_type", label: "Status" },
                  { id: "age_limit", label: "Age limit" },
                  { id: "duration", label: "Duration" },
                  { id: "Release_date", label: "Release date" },
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
                {!loading &&
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <MovieTableRow
                        key={row.film_id}
                        row={row}
                        selected={table.selected.includes(row.film_id)}
                        onSelectRow={() => table.onSelectRow(row.film_id)}
                        onDelete={(id) => {
                          setMovies((prevMovies) =>
                            prevMovies.filter((movie) => movie.movie_id !== id)
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
              },
            }}
            component="div"
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            labelRowsPerPage="Row per page:"
          />
        )}
      </Card>
    </DashboardContent>
  );
}