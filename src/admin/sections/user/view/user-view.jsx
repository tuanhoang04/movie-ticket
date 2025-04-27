import { useState, useEffect, useMemo } from "react";
import { applyFilter, emptyRows, getComparator } from "../../utils";
import { DashboardContent } from "../../../layouts/dashboard";
import {
  Box,
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
import { UserTableHead } from "../user-table-head";
import { UserTableToolbar } from "../user-table-toolbar";
import { Scrollbar } from "../../../components/scrollbar";
import { UserTableRow } from "../user-table-row";
import { TableEmptyRows } from "../../table-empty-rows";
import { TableNoData } from "../../table-no-data";
import { useTable } from "../use-table";

export function UserView() {
  const table = useTable();
  const [filterName, setFilterName] = useState("");
  const [users, setUsers] = useState([]);
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

      for (const userId of table.selected) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/users/delete/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete user with ID: ${userId}`);
        }
      }

      setSnackbar({
        open: true,
        message: "Delete user successfully",
        severity: "success",
      });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !table.selected.includes(user.user_id))
      );
      table.setSelected([]);
      console.log("Selected users deleted successfully.");
    } catch (error) {
      console.error("Error deleting selected users:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
          console.error("JWT token is missing");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredData = useMemo(() => {
    return applyFilter({
      inputData: users,
      comparator: getComparator(table.order, table.orderBy),
      filterName,
      attribute: selectedFilter,
    });
  }, [users, table.order, table.orderBy, filterName, selectedFilter]);

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
            color: "#FFFFFF",
            fontWeight: "bold",
          }}
        >
          Users Management
        </Typography>
      </Box>

      <Card
        sx={{
          bgcolor: "#323137",
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
        }}
      >
        <UserTableToolbar
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
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((user) => user.user_id)
                  )
                }
                headLabel={[
                  { id: "username", label: "Username" },
                  { id: "email", label: "Email" },
                  { id: "phone_number", label: "Phone number" },
                  { id: "role", label: "Role" },
                  { id: "status", label: "Status" },
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
                      <UserTableRow
                        key={row.user_id}
                        row={row}
                        selected={table.selected.includes(row.user_id)}
                        onSelectRow={() => table.onSelectRow(row.user_id)}
                        onDelete={(id) => {
                          setSnackbar({
                            open: true,
                            message: "Delete user successfully",
                            severity: "success",
                          });
                          setUsers((prevUsers) =>
                            prevUsers.filter((user) => user.user_id !== id)
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
          sx={{ width: "100%", fontSize: "1.25rem", color: "#FFFFFF" }}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}