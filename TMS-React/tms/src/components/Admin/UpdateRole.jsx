import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Stack,
  Snackbar,
  Alert,
  Slide,
  IconButton,
  CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export default function UpdateRole() {
  const [roles, setRoles] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({ rolename: "", roleDesc: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    text: "",
  });

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

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValues({
      rolename: roles[index].rolename,
      roleDesc: roles[index].roleDesc,
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditValues({ rolename: "", roleDesc: "" });
  };

  const handleChange = (e) => {
    setEditValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (index) => {
    setLoading(true);
    try {
      await axios.put("http://localhost:7777/api/admin/roles", {
        rolename: editValues.rolename,
        roleDesc: editValues.roleDesc,
      });
      setSnackbar({
        open: true,
        type: "success",
        text: "Role updated successfully!",
      });
      // Update local roles array
      setRoles((prev) =>
        prev.map((role, idx) =>
          idx === index
            ? { ...role, rolename: editValues.rolename, roleDesc: editValues.roleDesc }
            : role
        )
      );
      setEditingIndex(null);
      setEditValues({ rolename: "", roleDesc: "" });
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text:
          err.response?.data ||
          "Failed to update role.",
      });
    } finally {
      setLoading(false);
    }
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
          Update Role
        </Typography>
        {fetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : roles.length === 0 ? (
          <Typography>No roles found.</Typography>
        ) : (
          <Stack spacing={2}>
            {roles.map((role, idx) => (
              <Paper key={role.rolename} sx={{ p: 2, bgcolor: "#f7faff" }}>
                {editingIndex === idx ? (
                  <Stack spacing={1}>
                    <TextField
                      label="Role Name"
                      name="rolename"
                      value={editValues.rolename}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled // Don't allow changing role name (as it's usually the key)
                    />
                    <TextField
                      label="Role Description"
                      name="roleDesc"
                      value={editValues.roleDesc}
                      onChange={handleChange}
                      fullWidth
                      required
                      multiline
                      minRows={2}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => handleUpdate(idx)}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CloseIcon />}
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
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
                      color="primary"
                      onClick={() => handleEdit(idx)}
                      size="large"
                    >
                      <EditIcon />
                    </IconButton>
                  </Stack>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
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
