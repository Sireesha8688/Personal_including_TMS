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
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InsurerEditHospital from "./InsurerEditHospital"; // Import the new edit component

// Define columns for the hospitals table
const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "networked", label: "Networked", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 180 },
  { id: "address", label: "Address", minWidth: 250 },
  { id: "phone", label: "Phone", minWidth: 150 },
  { id: "actions", label: "Actions", minWidth: 120 },
];

const InsurerManageHospitals = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [editHospital, setEditHospital] = useState(null); // State to hold hospital being edited/created

  // Function to fetch hospital data from the API
  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9090/hospitals`);
      setRows(res.data);
    } catch (e) {
      console.error("Error fetching hospitals:", e); // Log the error for debugging
      setRows([]);
      // You might want to show an alert to the user here
      // alert("Failed to fetch hospitals.");
    }
    setLoading(false);
  };

  // useEffect hook to fetch data when the component mounts or when editHospital state changes
  useEffect(() => {
    if (!editHospital) {
      // Only fetch if not currently editing/creating a hospital
      fetchHospitals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editHospital]); // Re-fetch data when returning from the edit/create form

  // Function to handle deleting a hospital
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await axios.delete(`http://localhost:9090/hospitals/${id}`);
        fetchHospitals(); // Re-fetch data after successful deletion
      } catch (error) {
        console.error(`Error deleting hospital ${id}:`, error);
        alert("Failed to delete hospital."); // Provide user feedback
      }
    }
  };

  // If editHospital is not null, render the InsurerEditHospital form
  if (editHospital !== null) {
    return (
      <InsurerEditHospital
        hospital={editHospital}
        onDone={() => setEditHospital(null)} // Callback to return to the list view
      />
    );
  }

  // Handle page change for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change for pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset page to 0 when rows per page changes
  };

  // Calculate the subset of rows to display based on current page and rowsPerPage
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = rows.slice(startIndex, endIndex);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Hospitals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setEditHospital({})} // Set an empty object to indicate new hospital creation
        >
          Add Hospital
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="hospitals table">
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
                  No hospitals found.
                </TableCell>
              </TableRow>
            ) : (
              // Use the paginatedRows for rendering
              paginatedRows.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.networked ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {/* Display address information */}
                    {row.address ? (
                      <>
                        {row.address.street}, {row.address.city},{" "}
                        {row.address.state} - {row.address.pincode}
                      </>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Display contact phone */}
                    {row.contact_info ? row.contact_info.phone : "—"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => setEditHospital(row)}
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
        count={rows.length} // Total count of all items
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default InsurerManageHospitals;
