import React, { useState } from "react";
import {
  Paper, Box, Typography, TextField, Button, MenuItem, Snackbar, Alert, Stack
} from "@mui/material";
import axios from "axios";

const initialState = {
  fname: "",
  lname: "",
  dateOfBirth: "",
  landlineNo: "",
  mobileNo: "",
  gender: "",
  tempAddr: "",
  permAddr: "",
  pincode: "",
  occupation: "",
  pancardNo: "",
  addProofName: "",
};

const genderOptions = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other" },
];

const proofOptions = [
  "Aadhaar", "Pan", "Voter ID", "Driving Licence", "Passport"
];

export default function RegisterOwner() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, type: "success", text: "" });
  const [errors, setErrors] = useState({});

  // Allow only digits and enforce maxLength
  const handleNumberChange = (e, maxLen) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > maxLen) value = value.slice(0, maxLen);
    setForm(prev => ({ ...prev, [e.target.name]: value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    // Mobile No: must be exactly 10 digits if entered
    if (form.mobileNo && form.mobileNo.length !== 10) {
      errs.mobileNo = "Mobile number must be exactly 10 digits";
    }
    // Landline No: must be exactly 10 digits if entered
    if (form.landlineNo && form.landlineNo.length !== 10) {
      errs.landlineNo = "Landline number must be exactly 10 digits";
    }
    // Pincode: required, must be exactly 6 digits
    if (!form.pincode || form.pincode.length !== 6) {
      errs.pincode = "Pincode must be exactly 6 digits";
    }
    // Pancard No: required, must match Indian PAN format
    if (!form.pancardNo || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pancardNo)) {
      errs.pancardNo = "PAN must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Prepare date as yyyy-MM-dd string and pincode as number
    const data = {
      ...form,
      dateOfBirth: form.dateOfBirth || null,
      pincode: form.pincode ? Number(form.pincode) : null,
    };
    try {
      await axios.post("http://localhost:7777/rto/owner/register", data, {
        headers: { "Content-Type": "application/json" }
      });
      setSnackbar({ open: true, type: "success", text: "Owner registered successfully!" });
      setForm(initialState);
    } catch (err) {
      setSnackbar({ open: true, type: "error", text: "Registration failed!" });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 10 }}>
      <Paper sx={{ p: 3, width: 400 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
          Register Owner
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              name="fname"
              value={form.fname}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Last Name"
              name="lname"
              value={form.lname}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              size="small"
            />
            <TextField
              label="Landline No"
              name="landlineNo"
              value={form.landlineNo}
              onChange={e => handleNumberChange(e, 10)}
              size="small"
              error={!!errors.landlineNo}
              helperText={errors.landlineNo}
              inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              label="Mobile No"
              name="mobileNo"
              value={form.mobileNo}
              onChange={e => handleNumberChange(e, 10)}
              size="small"
              error={!!errors.mobileNo}
              helperText={errors.mobileNo}
              inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              label="Gender"
              name="gender"
              select
              value={form.gender}
              onChange={handleChange}
              required
              size="small"
            >
              {genderOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Temporary Address"
              name="tempAddr"
              value={form.tempAddr}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Permanent Address"
              name="permAddr"
              value={form.permAddr}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={e => handleNumberChange(e, 6)}
              required
              size="small"
              error={!!errors.pincode}
              helperText={errors.pincode}
              inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              label="Occupation"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Pancard No"
              name="pancardNo"
              value={form.pancardNo}
              onChange={e => {
                // Force uppercase input
                handleChange({ target: { name: "pancardNo", value: e.target.value.toUpperCase() } });
              }}
              required
              size="small"
              error={!!errors.pancardNo}
              helperText={errors.pancardNo}
              inputProps={{ maxLength: 10 }}
            />
            <TextField
              label="Address Proof Name"
              name="addProofName"
              select
              value={form.addProofName}
              onChange={handleChange}
              required
              size="small"
            >
              {proofOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </Stack>
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.type} sx={{ width: "100%" }}>
            {snackbar.text}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
