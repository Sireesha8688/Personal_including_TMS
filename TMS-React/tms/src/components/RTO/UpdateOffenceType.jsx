import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, TextField,
  Button, Snackbar, Alert, Box, Paper, Typography
} from '@mui/material';
import axios from 'axios';

export default function UpdateOffenceType() {
  const [offences, setOffences] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:7777/rto/offence-types");
    setOffences(res.data);
  };

  const handleChange = (index, field, value) => {
    const updated = [...offences];
    updated[index][field] = value;
    setOffences(updated);
  };

  const handleUpdate = async (offence) => {
    try {
      await axios.put("http://localhost:7777/rto/offence-type/update", offence);
      setSnackbar({ open: true, message: "Offence updated successfully", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update offence", severity: "error" });
    }
  };

  return (
    <Box sx={{ mt: 5, maxWidth: 1000, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Update Offence Types</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offences.map((offence, index) => (
              <TableRow key={offence.offenceId}>
                <TableCell>{offence.offenceId}</TableCell>
                <TableCell>
                  <TextField value={offence.offenceType} onChange={(e) => handleChange(index, 'offenceType', e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField value={offence.penalty} type="number" onChange={(e) => handleChange(index, 'penalty', e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField value={offence.vehType} onChange={(e) => handleChange(index, 'vehType', e.target.value)} />
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleUpdate(offence)}>Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
