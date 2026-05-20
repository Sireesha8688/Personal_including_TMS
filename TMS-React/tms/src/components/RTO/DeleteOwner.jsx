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

export default function DeleteOwner() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, type: "success", text: "" });

  // Fetch owners on mount
  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:7777/rto/owners");
      setOwners(res.data);
    } catch (err) {
      setSnackbar({ open: true, type: "error", text: "Failed to fetch owners" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ownerId) => {
    if (!window.confirm(`Are you sure you want to delete owner ID ${ownerId}?`)) return;
    setDeletingId(ownerId);
    try {
      await axios.delete(`http://localhost:7777/rto/owner/delete/${ownerId}`);
      setSnackbar({ open: true, type: "success", text: `Owner ${ownerId} deleted successfully` });
      fetchOwners(); // Refresh list
    } catch (err) {
      setSnackbar({ open: true, type: "error", text: `Failed to delete owner ${ownerId}` });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSnackbarClose = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 10 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
          Delete Owner
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : owners.length === 0 ? (
          <Typography>No owners found.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Owner ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Pincode</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners.map((owner) => (
                <TableRow key={owner.ownerId}>
                  <TableCell>{owner.ownerId}</TableCell>
                  <TableCell>{owner.fname}</TableCell>
                  <TableCell>{owner.lname}</TableCell>
                  <TableCell>{owner.mobileNo || "-"}</TableCell>
                  <TableCell>{owner.gender}</TableCell>
                  <TableCell>{owner.pincode}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={deletingId === owner.ownerId}
                      onClick={() => handleDelete(owner.ownerId)}
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
                      {deletingId === owner.ownerId ? "Deleting..." : "Delete"}
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
