import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
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
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export default function DeleteUser() {
  const [users, setUsers] = useState([]);
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

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const res = await axios.get("http://localhost:7777/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Failed to fetch users.",
      });
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteClick = (user) => {
    setToDelete(user);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:7777/api/admin/users/${encodeURIComponent(toDelete.username)}`
      );
      setSnackbar({
        open: true,
        type: "success",
        text: `User '${toDelete.username}' deleted successfully!`,
      });
      setUsers((prev) => prev.filter((u) => u.username !== toDelete.username));
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text: err.response?.data || "Failed to delete user.",
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
          Delete User
        </Typography>
        {fetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <Stack spacing={2}>
            {users.map((user) => (
              <Paper key={user.username} sx={{ p: 2, bgcolor: "#f7faff" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ sm: "center" }}
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {user.username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      Role: {user.rolename}
                    </Typography>
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(user)}
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
            Are you sure you want to delete the user <b>{toDelete?.username}</b>?
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
