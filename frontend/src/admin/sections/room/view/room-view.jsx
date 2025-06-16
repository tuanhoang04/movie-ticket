import { useState, useEffect, useMemo } from "react";
import { hook } from "../hook";
import { applyFilter, getComparator } from "../../utils";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { RoomTableToolbar } from "../room-table-toolbar";
import { Scrollbar } from "../../../components/scrollbar";
import { RoomTableHead } from "../room-table-head";
import { RoomTableRow } from "../room-table-row";
import { TableNoData } from "../../table-no-data";
import { Iconify } from "../../../components/iconify";
import { Link } from "react-router-dom";

export function RoomView() {
  const table = hook();
  const [filterName, setFilterName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("room_name");
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

      for (const roomId of table.selected) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/rooms/delete/${roomId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete room with ID: ${roomId}`);
        }
      }
      setSnackbar({
        open: true,
        message: "Delete room successfully",
        severity: "success",
      });
      setRooms((prevRooms) =>
        prevRooms.filter((room) => !table.selected.includes(room.room_id))
      );
      table.setSelected([]);
      console.log("Selected rooms deleted successfully.");
    } catch (error) {
      console.error("Error deleting selected rooms:", error);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/rooms`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch rooms");

        const data = await response.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredData = useMemo(() => {
    return applyFilter({
      inputData: rooms,
      comparator: getComparator(table.order, table.orderBy),
      filterName,
      attribute: selectedFilter,
    });
  }, [rooms, table.order, table.orderBy, filterName, selectedFilter]);

  useEffect(() => {
    setDataFiltered(filteredData);
  }, [filteredData]);

  const notFound = !dataFiltered.length && filterName;

  const handleEditSuccess = (roomId, updatedData) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.room_id === roomId ? { ...room, ...updatedData } : room
      )
    );
  };

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
          Cinema Rooms Management
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<Iconify icon="mingcute:add-line" />}
          component={Link}
          to="/admin/room/create"
          sx={{ fontSize: "1.1rem" }}
        >
          Add room
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
        <RoomTableToolbar
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
              <RoomTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => {
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((room) => room.room_id)
                  );
                }}
                headLabel={[
                  { id: "room_name", label: "Theater Room Name" },
                  { id: "cinema_name", label: "Cinema Name" },
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
                {!loading &&
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <RoomTableRow
                        key={row.room_id}
                        row={row}
                        selected={table.selected.includes(row.room_id)}
                        onSelectRow={() => table.onSelectRow(row.room_id)}
                        onDelete={(id) => {
                          setSnackbar({
                            open: true,
                            message: "Delete room successfully",
                            severity: "success",
                          });
                          setRooms((prevRooms) =>
                            prevRooms.filter((room) => room.room_id !== id)
                          );
                          table.setSelected((prevSelected) =>
                            prevSelected.filter(
                              (selectedId) => selectedId !== id
                            )
                          );
                        }}
                        onEditSuccess={handleEditSuccess}
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
            labelRowsPerPage="Row per page:"
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
