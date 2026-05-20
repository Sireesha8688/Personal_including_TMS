import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";

export default function ListUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all users from backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:7777/api/admin/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
      <Paper sx={{ p: 3, minWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          All Users
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <List>
            {users.length > 0 ? (
              users.map((user) => (
                <ListItem key={user.username}>
                  <ListItemText
                    primary={user.username}
                    secondary={`Role: ${user.rolename}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No users found.
              </Typography>
            )}
          </List>
        )}
      </Paper>
    </Box>
  );
}
