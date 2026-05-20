import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function DeleteVehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingVehNo, setDeletingVehNo] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, type: "success", text: "" });

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:7777/rto/vehicles");
      setVehicles(res.data);
    } catch {
      setSnackbar({ open: true, type: "error", text: "Failed to fetch vehicles" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehNo) => {
    if (!window.confirm(`Are you sure you want to delete vehicle ${vehNo}?`)) return;
    setDeletingVehNo(vehNo);
    try {
      await axios.delete(`http://localhost:7777/rto/vehicle/delete/${vehNo}`);
      setSnackbar({ open: true, type: "success", text: `Vehicle ${vehNo} deleted successfully` });
      fetchVehicles();
    } catch {
      setSnackbar({ open: true, type: "error", text: `Failed to delete vehicle ${vehNo}` });
    } finally {
      setDeletingVehNo(null);
    }
  };

  const handleSnackbarClose = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 10 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
          Delete Vehicle
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : vehicles.length === 0 ? (
          <Typography>No vehicles found.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>App No</TableCell>
                <TableCell>Vehicle Number</TableCell>
                <TableCell>Vehicle Name</TableCell>
                <TableCell>Engine No</TableCell>
                <TableCell>Date of Purchase</TableCell>
                <TableCell>Distributor Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((reg) => (
                <TableRow key={reg.appNo}>
                  <TableCell>{reg.appNo}</TableCell>
                  <TableCell>{reg.vehNo}</TableCell>
                  <TableCell>{reg.vehicle?.vehName || "-"}</TableCell>
                  <TableCell>{reg.vehicle?.engineNo || "-"}</TableCell>
                  <TableCell>{reg.dateOfPurchase}</TableCell>
                  <TableCell>{reg.distributerName}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={deletingVehNo === reg.vehNo}
                      onClick={() => handleDelete(reg.vehNo)}
                      sx={{
                        color: "#1976d2",
                        borderColor: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#1976d2",
                          color: "white",
                          borderColor: "#1976d2",
                        },
                      }}
                    >
                      {deletingVehNo === reg.vehNo ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.type} sx={{ width: "100%" }}>
            {snackbar.text}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
