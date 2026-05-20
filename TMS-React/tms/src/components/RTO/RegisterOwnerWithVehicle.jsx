import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, TextField, MenuItem, Button,
  Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

export default function RegisterOwnerWithVehicle() {
  const [owners, setOwners] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    vehNo: '',
    vehicleId: '',
    ownerId: '',
    dateOfPurchase: '',
    distributerName: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchOwners();
    fetchUnregisteredVehicles();
  }, []);

  const fetchOwners = async () => {
    const res = await axios.get('http://localhost:7777/rto/owners');
    setOwners(res.data);
  };

  const fetchUnregisteredVehicles = async () => {
    const res = await axios.get('http://localhost:7777/rto/api/vehicles/unregistered');
    setVehicles(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateVehicleNo = (vehNo) => /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3,4}$/.test(vehNo);

  const handleSubmit = async () => {
    if (!validateVehicleNo(form.vehNo)) {
      return setSnackbar({ open: true, message: 'Invalid Vehicle Number Format!', severity: 'error' });
    }

    const owner = owners.find(o => o.ownerId === parseInt(form.ownerId));
    const vehicle = vehicles.find(v => v.vehId === parseInt(form.vehicleId));

    if (!owner || !vehicle) {
      return setSnackbar({ open: true, message: 'Invalid owner or vehicle selection', severity: 'error' });
    }

    const dto = {
      owner: owner,
      registration: {
        vehNo: form.vehNo,
        dateOfPurchase: form.dateOfPurchase,
        distributerName: form.distributerName,
        vehicle: vehicle
      }
    };

    try {
      await axios.post('http://localhost:7777/rto/owner-vehicle/register', dto);
      setSnackbar({ open: true, message: 'Registration successful!', severity: 'success' });
      setForm({ vehNo: '', vehicleId: '', ownerId: '', dateOfPurchase: '', distributerName: '' });
      fetchUnregisteredVehicles(); // refresh vehicle list
    } catch (err) {
      setSnackbar({ open: true, message: 'Registration failed!', severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Register Owner with Vehicle
        </Typography>

        {/* Owner Dropdown */}
        <TextField
          select fullWidth label="Select Owner"
          name="ownerId"
          value={form.ownerId}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          {owners.map((owner) => (
            <MenuItem key={owner.ownerId} value={owner.ownerId}>
              {owner.ownerId} - {owner.fname} {owner.lname}
            </MenuItem>
          ))}
        </TextField>

        {/* Vehicle Dropdown */}
        <TextField
          select fullWidth label="Select Vehicle"
          name="vehicleId"
          value={form.vehicleId}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          {vehicles.map((v) => (
            <MenuItem key={v.vehId} value={v.vehId}>
              {v.vehId} - {v.vehName} | Engine No: {v.engineNo}
            </MenuItem>
          ))}
        </TextField>

        {/* Vehicle Number */}
        <TextField
          fullWidth label="Vehicle Number (e.g., AP89SI899)"
          name="vehNo"
          value={form.vehNo}
          onChange={handleChange}
          sx={{ mb: 2 }}
          inputProps={{ style: { textTransform: 'uppercase' } }}
        />

        {/* Purchase Date */}
        <TextField
          fullWidth type="date"
          label="Date of Purchase"
          name="dateOfPurchase"
          value={form.dateOfPurchase}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        {/* Distributor Name */}
        <TextField
          fullWidth label="Distributor Name"
          name="distributerName"
          value={form.distributerName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Register
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
