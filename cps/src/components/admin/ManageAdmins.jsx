import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminsForm from "./AdminsForms";

const columns = [
  { id: "name", label: "Admin Name", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 250 },
  { id: "password", label: "Password", minWidth: 150 },
  { id: "actions", label: "Actions", minWidth: 120, align: "center" }
];

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0), [rowsPerPage, setRowsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false), [formData, setFormData] = useState(null);
  const [delOpen, setDelOpen] = useState(false), [delAdmin, setDelAdmin] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9090/admins")
      .then(r => r.json()).then(setAdmins);
  }, []);

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormSubmit = data => {
    if (formData) {
      fetch(`http://localhost:9090/admins/${formData.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: formData.id })
      }).then(r => r.ok && setAdmins(adms => adms.map(a => a.id === formData.id ? { ...data, id: formData.id } : a)));
    } else {
      fetch("http://localhost:9090/admins", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(r => r.json()).then(newA => setAdmins(adms => [...adms, newA]));
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    fetch(`http://localhost:9090/admins/${delAdmin.id}`, { method: "DELETE" })
      .then(r => r.ok && setAdmins(adms => adms.filter(a => a.id !== delAdmin.id)));
    setDelOpen(false);
  };

  return (
    <Box sx={{ py: 4, px: 2, minHeight: "100vh", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom align="center">Manage Admins</Typography>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search admins..."
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <Button variant="contained" onClick={() => { setFormData(null); setFormOpen(true); }}>Add Admin</Button>
        </Box>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell
                      key={col.id}
                      align={col.align}
                      style={{
                        backgroundColor: "#1565c0",
                        color: "#fff",
                        minWidth: col.minWidth,
                        fontWeight: "bold",
                        textTransform: "uppercase"
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(admin => (
                  <TableRow key={admin.id} hover>
                    {columns.map(col => col.id === "actions" ? (
                      <TableCell key={col.id} align={col.align}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton color="primary" onClick={() => { setFormData(admin); setFormOpen(true); }}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => { setDelAdmin(admin); setDelOpen(true); }}><DeleteIcon /></IconButton>
                        </Stack>
                      </TableCell>
                    ) : (
                      <TableCell key={col.id} align={col.align}>{admin[col.id]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, np) => setPage(np)}
            onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
          />
        </Paper>
      </Box>
      <AdminsForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={formData}
      />
      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete admin <b>{delAdmin?.name}</b>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDelOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
