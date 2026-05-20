import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InsurerEditCustomer from "./InsurerEditCustomer"; // Ensure this path is correct
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "aadharcardNumber", label: "Aadhar Number", minWidth: 120 },
  { id: "email", label: "Email", minWidth: 180 },
  { id: "mobile_number", label: "Mobile Number", minWidth: 120 }, // Added for display
  { id: "policies", label: "Policies", minWidth: 200 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

const InsurerManageCustomers = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9090/customers`);
      setRows(res.data);
    } catch (e) {
      console.error("Error fetching customers:", e);
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!editCustomer) {
      fetchCustomers();
    }
  }, [editCustomer]); // Only re-fetch when editCustomer changes (i.e., after saving/canceling edit)

  const handleDelete = async (id) => {
    // In a real app, use a custom modal for confirmation.
    if (window.confirm("Are you sure you want to delete this customer?")) {
      // Using window.confirm as per original code context
      try {
        await axios.delete(`http://localhost:9090/customers/${id}`);
        fetchCustomers(); // Re-fetch data after deletion
      } catch (error) {
        console.error(`Error deleting customer ${id}:`, error);
        alert("Failed to delete customer."); // Using alert as per original code context
      }
    }
  };

  if (editCustomer !== null) {
    return (
      <InsurerEditCustomer
        customer={editCustomer}
        onDone={() => setEditCustomer(null)}
      />
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = rows.slice(startIndex, endIndex);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setEditCustomer({})} // Pass an empty object for new customer
        >
          Add Customer
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="customers table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.aadharcardNumber}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.mobile_number || "—"}</TableCell>{" "}
                  {/* Display mobile number */}
                  <TableCell>
                    {row.policies && row.policies.length > 0
                      ? row.policies
                          .map(
                            (p) =>
                              `#${p.policyId} (${p.bought_date} - ${p.expiry_date})`
                          )
                          .join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => setEditCustomer(row)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default InsurerManageCustomers;
