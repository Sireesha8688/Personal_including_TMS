import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, InputAdornment, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiersForm from "./VerifiersForm";

const columns = [
  { id: "name", label: "Verifier Name", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 220 },
  { id: "password", label: "Password", minWidth: 120 },
  { id: "claimTypesAuthorized", label: "Authorized Claim Types", minWidth: 250 },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" }
];

export default function ManageVerifiers() {
  const [verifiers, setVerifiers] = useState([]);
  const [claimTypes, setClaimTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [delOpen, setDelOpen] = useState(false);
  const [delVerifier, setDelVerifier] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch verifiers and claim types on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:9090/verifiers").then(r => r.json()),
      fetch("http://localhost:9090/claimTypes").then(r => r.json())
    ]).then(([verifiersData, claimTypesData]) => {
      setVerifiers(verifiersData);
      setClaimTypes(claimTypesData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Filter verifiers by search
  const filtered = verifiers.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Add/Edit Verifier
  const handleFormSubmit = data => {
    if (formData) {
      // Edit
      fetch(`http://localhost:9090/verifiers/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...data }),
      }).then(r => {
        if (r.ok) {
          setVerifiers(vs => vs.map(v => v.id === formData.id ? { ...formData, ...data } : v));
        }
      });
    } else {
      // Add
      fetch("http://localhost:9090/verifiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => r.json()).then(newV => {
        setVerifiers(vs => [...vs, newV]);
      });
    }
    setFormOpen(false);
  };

  // Delete Verifier
  const handleDelete = () => {
    fetch(`http://localhost:9090/verifiers/${delVerifier.id}`, { method: "DELETE" })
      .then(r => {
        if (r.ok) {
          setVerifiers(vs => vs.filter(v => v.id !== delVerifier.id));
        }
      });
    setDelOpen(false);
  };

  return (
    <Box sx={{ py: 4, px: 2, minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom align="center">Manage Verifiers</Typography>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search verifiers..."
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <Button variant="contained" onClick={() => { setFormData(null); setFormOpen(true); }}>Add Verifier</Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: 200 }}>
            <CircularProgress />
          </Box>
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
                  {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(verifier => (
                    <TableRow key={verifier.id} hover>
                      {columns.map(col => {
                        if (col.id === "actions") {
                          return (
                            <TableCell key={col.id} align={col.align}>
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <IconButton
                                  color="primary"
                                  onClick={() => { setFormData(verifier); setFormOpen(true); }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => { setDelVerifier(verifier); setDelOpen(true); }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          );
                        } else if (col.id === "claimTypesAuthorized") {
                          // Show claim type names from IDs
                          const names = (verifier.claimTypesAuthorized || [])
                            .map(ctId => claimTypes.find(c => c.id === ctId)?.type)
                            .filter(Boolean)
                            .join(", ");
                          return (
                            <TableCell key={col.id} align={col.align}>
                              {names || ""}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={col.id} align={col.align}>
                              {verifier[col.id] || ""}
                            </TableCell>
                          );
                        }
                      })}
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

      <VerifiersForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={formData}
        claimTypes={claimTypes}
      />

      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete verifier <b>{delVerifier?.name}</b>?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDelOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
