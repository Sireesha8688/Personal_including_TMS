import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, InputAdornment, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PolicyForm from "./PolicyForm";

const columns = [
  { id: "name", label: "Policy Name", minWidth: 150 },
  { id: "description", label: "Description", minWidth: 220 },
  { id: "covers", label: "Covers", minWidth: 220 },
  { id: "sumAssured", label: "Sum Assured", minWidth: 120, align: "right" },
  { id: "premium", label: "Premium", minWidth: 120, align: "right" },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" }
];

export default function ManagePolicies() {
  const [policies, setPolicies] = useState([]);
  const [covers, setCovers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0), [rowsPerPage, setRowsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false), [formData, setFormData] = useState(null);
  const [delOpen, setDelOpen] = useState(false), [delPolicy, setDelPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:9090/policy").then(r => r.json()),
      fetch("http://localhost:9090/covers").then(r => r.json())
    ]).then(([policyData, coversData]) => {
      setPolicies(policyData);
      setCovers(coversData);
      setLoading(false);
    });
  }, []);

  const filtered = policies.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormSubmit = data => {
    if (formData) {
      fetch(`http://localhost:9090/policy/${formData.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: formData.id })
      }).then(r => {
        if (r.ok) {
          setPolicies(ps => ps.map(p => p.id === formData.id ? { ...data, id: formData.id } : p));
        }
      });
    } else {
      fetch("http://localhost:9090/policy", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(r => r.json()).then(newP => setPolicies(ps => [...ps, newP]));
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    fetch(`http://localhost:9090/policy/${delPolicy.id}`, { method: "DELETE" })
      .then(r => r.ok && setPolicies(ps => ps.filter(p => p.id !== delPolicy.id)));
    setDelOpen(false);
  };

  return (
    <Box sx={{ py: 4, px: 2, minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom align="center">Manage Policies</Typography>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search policies..."
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <Button variant="contained" onClick={() => { setFormData(null); setFormOpen(true); }}>Add Policy</Button>
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
                            <IconButton color="error" onClick={() => { setDelPolicy(row); setDelOpen(true); }}><DeleteIcon /></IconButton>
                          </Stack>
                        </TableCell>
                      ) : (
                        <TableCell key={col.id} align={col.align}>
                          {col.id === "covers"
                            ? (row.covers || [])
                                .map(coverId => {
                                  const cover = covers.find(c => c.id === String(coverId));
                                  return cover ? cover.coverName : coverId;
                                })
                                .join(", ")
                            : row[col.id]}
                        </TableCell>
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
      <PolicyForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={formData}
        coversList={covers}
      />
      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete policy <b>{delPolicy?.name}</b>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDelOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
