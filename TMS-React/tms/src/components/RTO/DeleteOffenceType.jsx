import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Snackbar, Alert, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

export default function DeleteOffenceType() {
  const [offences, setOffences] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchOffences = async () => {
    const res = await axios.get('http://localhost:7777/rto/offence-types');
    setOffences(res.data);
  };

  const deleteOffence = async (id) => {
    try {
      await axios.delete(`http://localhost:7777/rto/offence-type/delete/${id}`);
      setSnackbar({ open: true, message: 'Offence deleted successfully!', severity: 'success' });
      fetchOffences();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete offence', severity: 'error' });
    }
  };

  useEffect(() => { fetchOffences(); }, []);

  return (
    <Box sx={{ mt: 5, maxWidth: 900, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Delete Offence Types</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Offence Type</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offences.map((offence) => (
              <TableRow key={offence.offenceId}>
                <TableCell>{offence.offenceId}</TableCell>
                <TableCell>{offence.offenceType}</TableCell>
                <TableCell>{offence.penalty}</TableCell>
                <TableCell>{offence.vehType}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => deleteOffence(offence.offenceId)}>Delete</Button>
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
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
