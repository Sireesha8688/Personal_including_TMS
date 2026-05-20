import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, InputAdornment, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InsurersForm from "./InsurersForm";

const columns = [
  { id: "name", label: "Insurer Name", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 220 },
  { id: "password", label: "Password", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" }
];

export default function ManageInsurers() {
  const [insurers, setInsurers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0), [rowsPerPage, setRowsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false), [formData, setFormData] = useState(null);
  const [delOpen, setDelOpen] = useState(false), [delInsurer, setDelInsurer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:9090/insurers")
      .then(r => r.json())
      .then(data => { setInsurers(data); setLoading(false); });
  }, []);

  const filtered = insurers.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormSubmit = data => {
    if (formData) {
      fetch(`http://localhost:9090/insurers/${formData.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...data })
      }).then(r => r.ok && setInsurers(is => is.map(i => i.id === formData.id ? { ...formData, ...data } : i)));
    } else {
      fetch("http://localhost:9090/insurers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(r => r.json()).then(newI => setInsurers(is => [...is, newI]));
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    fetch(`http://localhost:9090/insurers/${delInsurer.id}`, { method: "DELETE" })
      .then(r => r.ok && setInsurers(is => is.filter(i => i.id !== delInsurer.id)));
    setDelOpen(false);
  };

  return (
    <Box sx={{ py: 4, px: 2, minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom align="center">Manage Insurers</Typography>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search insurers..."
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <Button variant="contained" onClick={() => { setFormData(null); setFormOpen(true); }}>Add Insurer</Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: 200 }}><CircularProgress /></Box>
        ) : (
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
                  {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                    <TableRow key={row.id} hover>
                      {columns.map(col => col.id === "actions" ? (
                        <TableCell key={col.id} align={col.align}>
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton color="primary" onClick={() => { setFormData(row); setFormOpen(true); }}><EditIcon /></IconButton>
                            <IconButton color="error" onClick={() => { setDelInsurer(row); setDelOpen(true); }}><DeleteIcon /></IconButton>
                          </Stack>
                        </TableCell>
                      ) : (
                        <TableCell key={col.id} align={col.align}>{row[col.id]}</TableCell>
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
        )}
      </Box>
      <InsurersForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={formData}
      />
      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete insurer <b>{delInsurer?.name}</b>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDelOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
