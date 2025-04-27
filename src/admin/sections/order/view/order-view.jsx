import { useState, useEffect, useMemo } from "react";
import { hook } from "../hook";
import { applyFilter, getComparator } from "../../utils";
import { DashboardContent } from "../../../layouts/dashboard";
import {
  Card,
  Box,
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
import { OrderTableToolbar } from "../order-table-toolbar";
import { Scrollbar } from "../../../components/scrollbar";
import { OrderTableHead } from "../order-table-head";
import { OrderTableRow } from "../order-table-row";
import { TableNoData } from "../../table-no-data";

export function OrderView() {
  const table = hook();
  const [filterName, setFilterName] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("username");
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

      for (const orderId of table.selected) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/orders/delete/${orderId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete order with ID: ${orderId}`);
        }
      }
      setSnackbar({
        open: true,
        message: "Delete order successfully",
        severity: "success",
      });
      setOrders((prevOrders) =>
        prevOrders.filter((order) => !table.selected.includes(order.order_id))
      );
      table.setSelected([]);
      console.log("Selected orders deleted successfully.");
    } catch (error) {
      console.error("Error deleting selected orders:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredData = useMemo(() => {
    return applyFilter({
      inputData: orders,
      comparator: getComparator(table.order, table.orderBy),
      filterName,
      attribute: selectedFilter,
    });
  }, [orders, table.order, table.orderBy, filterName, selectedFilter]);

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
          Orders Management
        </Typography>
      </Box>

      <Card>
        <OrderTableToolbar
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
              <OrderTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((order) => order.order_id)
                  )
                }
                headLabel={[
                  { id: "order_id", label: "Order ID" },
                  { id: "username", label: "Username" },
                  { id: "film_name", label: "Film Name" },
                  { id: "cinema_name", label: "Cinema Name" },
                  { id: "room_name", label: "Theater Room Name" },
                  { id: "show_date", label: "Show Date" },
                  { id: "total_price", label: "Total Price" },
                  { id: "order_date", label: "Order Date" },
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
                      <OrderTableRow
                        key={row.order_id}
                        row={row}
                        selected={table.selected.includes(row.order_id)}
                        onSelectRow={() => table.onSelectRow(row.order_id)}
                        onDelete={(id) => {
                          setSnackbar({
                            open: true,
                            message: "Delete room successfully",
                            severity: "success",
                          });
                          setOrders((prevOrders) =>
                            prevOrders.filter((order) => order.order_id !== id)
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
