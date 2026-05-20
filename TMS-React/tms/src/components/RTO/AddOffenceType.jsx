import React, { useState } from 'react';
import { TextField, Button, Box, Paper, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

export default function AddOffenceType() {
  const [form, setForm] = useState({ offenceType: '', penalty: '', vehType: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:7777/rto/offence-type/add', form);
      setForm({ offenceType: '', penalty: '', vehType: '' });
      setSnackbar({ open: true, message: 'Offence added successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add offence', severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Add Offence Type</Typography>
        <TextField fullWidth label="Offence Type" name="offenceType" value={form.offenceType} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Penalty" type="number" name="penalty" value={form.penalty} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Vehicle Type" name="vehType" value={form.vehType} onChange={handleChange} sx={{ mb: 2 }} />
        <Button variant="contained" onClick={handleSubmit}>Add Offence</Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
