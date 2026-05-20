import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const initialState = {
  vehType: "",
  engineNo: "",
  modelNo: "",
  vehName: "",
  vehColor: "",
  manufacturerName: "",
  dateOfManufacture: "",
  noOfCylinders: "",
  cubicCapacity: "",
  fuelUsed: "",
};

export default function RegisterVehicle() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    text: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [name]: numericValue }));
  };

  const validate = () => {
    const requiredFields = [
      "vehType",
      "engineNo",
      "modelNo",
      "vehName",
      "manufacturerName",
      "dateOfManufacture",
    ];
    for (let field of requiredFields) {
      if (!form[field]) {
        return `Please fill the ${field}`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setSnackbar({ open: true, type: "error", text: error });
      return;
    }
    setLoading(true);

    const data = {
      ...form,
      noOfCylinders: form.noOfCylinders ? Number(form.noOfCylinders) : null,
      cubicCapacity: form.cubicCapacity ? Number(form.cubicCapacity) : null,
    };

    try {
      await axios.post("http://localhost:7777/rto/vehicle/register", data, {
        headers: { "Content-Type": "application/json" },
      });
      setSnackbar({
        open: true,
        type: "success",
        text: "Vehicle registered successfully!",
      });
      setForm(initialState);
    } catch (error) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Vehicle registration failed!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" gutterBottom>
          Register Vehicle
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Vehicle Type"
              name="vehType"
              value={form.vehType}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Engine Number"
              name="engineNo"
              value={form.engineNo}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Model Number"
              name="modelNo"
              value={form.modelNo}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Vehicle Name"
              name="vehName"
              value={form.vehName}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Vehicle Color"
              name="vehColor"
              value={form.vehColor}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Manufacturer Name"
              name="manufacturerName"
              value={form.manufacturerName}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Date of Manufacture"
              name="dateOfManufacture"
              type="date"
              value={form.dateOfManufacture}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              size="small"
            />
            <TextField
              label="Number of Cylinders"
              name="noOfCylinders"
              value={form.noOfCylinders}
              onChange={handleNumberChange}
              size="small"
              inputProps={{ inputMode: "numeric" }}
            />
            <TextField
              label="Cubic Capacity"
              name="cubicCapacity"
              value={form.cubicCapacity}
              onChange={handleNumberChange}
              size="small"
              inputProps={{ inputMode: "numeric" }}
            />
            <TextField
              label="Fuel Used"
              name="fuelUsed"
              value={form.fuelUsed}
              onChange={handleChange}
              size="small"
            />
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </Stack>
        </form>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.type}
            sx={{ width: "100%" }}
          >
            {snackbar.text}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );

 
}
