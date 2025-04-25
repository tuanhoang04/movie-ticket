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
  TableBody,
  Icon,
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
            // credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete showtime with ID: ${showtimeId}`);
        }
      }

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
            // credentials: 'include',
          }
        );

        if (!response.ok) throw new Error("Failed to fetch showtimes");

        const data = await response.json();
        // console.log(data);
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
          }}
        >
          Quản lý suất chiếu phim
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<Iconify icon="mingcute:add-line" />}
          component={Link}
          to="/admin/showtime/create"
        >
          Thêm suất chiếu
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
                  { id: "showtime_id", label: "ID suất chiếu" },
                  { id: "film_name", label: "Tên phim" },
                  { id: "cinema_name", label: "Tên rạp chiếu" },
                  { id: "room_name", label: "Tên phòng chiếu" },
                  { id: "show_time", label: "Giờ chiếu" },
                  { id: "show_date", label: "Ngày chiếu" },
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
            component="div"
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
          />
        )}
      </Card>
    </DashboardContent>
  );
}
