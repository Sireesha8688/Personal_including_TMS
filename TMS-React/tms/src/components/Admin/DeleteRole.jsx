import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Box,
  Stack,
  Snackbar,
  Alert,
  Slide,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export default function DeleteRole() {
  const [roles, setRoles] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    text: "",
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Fetch all roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setFetching(true);
    try {
      const res = await axios.get("http://localhost:7777/api/admin/roles");
      setRoles(res.data);
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Failed to fetch roles.",
      });
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteClick = (role) => {
    setToDelete(role);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      // Send DELETE request to backend
      await axios.delete(
        `http://localhost:7777/api/admin/roles/${encodeURIComponent(toDelete.rolename)}`
      );
      setSnackbar({
        open: true,
        type: "success",
        text: `Role '${toDelete.rolename}' deleted successfully!`,
      });
      // Remove role from UI only after successful delete
      setRoles((prev) => prev.filter((r) => r.rolename !== toDelete.rolename));
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text: err.response?.data || "Failed to delete role.",
      });
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setToDelete(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        bgcolor: "#e3eafc",
        py: 4,
        px: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop:"50px"
      }}
    >
      <Paper sx={{ p: 3, mb: 3, minWidth: 350 }}>
        <Typography variant="h5" sx={{ color: "#1976d2", mb: 2 }}>
          Delete Role
        </Typography>
        {fetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : roles.length === 0 ? (
          <Typography>No roles found.</Typography>
        ) : (
          <Stack spacing={2}>
            {roles.map((role) => (
              <Paper key={role.rolename} sx={{ p: 2, bgcolor: "#f7faff" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ sm: "center" }}
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {role.rolename}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      {role.roleDesc}
                    </Typography>
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(role)}
                    size="large"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the role <b>{toDelete?.rolename}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.type}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
