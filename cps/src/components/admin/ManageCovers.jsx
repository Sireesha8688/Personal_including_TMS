import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, InputAdornment, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CoversForm from "./CoversForm";

const columns = [
  { id: "coverName", label: "Cover Name", minWidth: 150 },
  { id: "description", label: "Description", minWidth: 200 },
  { id: "coverAmount", label: "Cover Amount", minWidth: 120, align: "right" },
  { id: "premium", label: "Premium", minWidth: 120, align: "right" },
  { id: "actions", label: "Actions", minWidth: 120, align: "center" }
];

export default function ManageCovers() {
  const [covers, setCovers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0), [rowsPerPage, setRowsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false), [formData, setFormData] = useState(null);
  const [delOpen, setDelOpen] = useState(false), [delCover, setDelCover] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCovers = () => {
    setLoading(true);
    fetch("http://localhost:9090/covers")
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch covers"))
      .then(data => { setCovers(data); setFiltered(data); setError(""); })
      .catch(err => setError(String(err))).finally(() => setLoading(false));
  };

  useEffect(fetchCovers, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(covers.filter(c =>
      c.coverName?.toLowerCase().includes(s) ||
      c.description?.toLowerCase().includes(s)
    ));
    setPage(0);
  }, [search, covers]);

  const handleFormSubmit = data => {
    if (formData) {
      fetch(`http://localhost:9090/covers/${formData.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: formData.id })
      }).then(r => r.ok && fetchCovers());
    } else {
      fetch("http://localhost:9090/covers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(r => r.ok && fetchCovers());
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    fetch(`http://localhost:9090/covers/${delCover.id}`, { method: "DELETE" })
      .then(r => r.ok && fetchCovers());
    setDelOpen(false);
  };

  return (
    <Box sx={{ py: 4, px: 2, minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom align="center">Manage Covers</Typography>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search covers..."
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <Button variant="contained" onClick={() => { setFormData(null); setFormOpen(true); }}>Add New Cover</Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: 200 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
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
                            <IconButton color="error" onClick={() => { setDelCover(row); setDelOpen(true); }}><DeleteIcon /></IconButton>
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
      <CoversForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={formData}
      />
      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete cover <b>{delCover?.coverName}</b>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDelOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
