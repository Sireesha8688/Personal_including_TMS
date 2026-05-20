import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box
} from "@mui/material";

export default function ListRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all roles from backend
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:7777/api/admin/roles");
        if (!response.ok) throw new Error("Failed to fetch roles");
        const data = await response.json();
        setRoles(data);
      } catch (err) {
        setError(err.message || "Error fetching roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

 return (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
    <Paper sx={{ p: 3, minWidth: 400 }}>
      <Typography variant="h5" gutterBottom>
        All Roles
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <List>
          {roles.length > 0 ? (
            roles.map((role) => (
              <ListItem key={role.rolename}>
                <ListItemText
                  primary={role.rolename}
                  secondary={role.roleDesc || "No description"}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No roles found.
            </Typography>
          )}
        </List>
      )}
    </Paper>
  </Box>
);
}