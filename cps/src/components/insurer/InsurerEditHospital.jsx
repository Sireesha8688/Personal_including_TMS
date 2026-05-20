import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Divider, // Added for visual separation
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Default structure for a new hospital
const defaultHospital = {
  name: "",
  networked: false,
  email: "",
  password: "",
  address: {
    street: "",
    city: "",
    state: "",
    pincode: "",
  },
  contact_info: {
    email: "",
    phone: "",
  },
  bankDetails: {
    // Added new bankDetails object
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  },
};

const InsurerEditHospital = ({ hospital, onDone }) => {
  const isEdit = Boolean(hospital && hospital.id);
  // Initialize form state, merging default values with existing hospital data for edits.
  // Ensure nested objects are also merged properly to avoid overwriting.
  const [form, setForm] = useState({
    ...defaultHospital,
    ...hospital,
    address: { ...defaultHospital.address, ...(hospital?.address || {}) },
    contact_info: {
      ...defaultHospital.contact_info,
      ...(hospital?.contact_info || {}),
    },
    bankDetails: {
      // Initialize bankDetails
      ...defaultHospital.bankDetails,
      ...(hospital?.bankDetails || {}),
    },
  });
  const [saving, setSaving] = useState(false);

  // Function to handle changes in form fields, including nested objects
  const handleField = (field, value, parentField = null) => {
    setForm((prevForm) => {
      if (parentField) {
        return {
          ...prevForm,
          [parentField]: {
            ...prevForm[parentField],
            [field]: value,
          },
        };
      }
      return { ...prevForm, [field]: value };
    });
  };

  // Function to handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await axios.put(`http://localhost:9090/hospitals/${form.id}`, form);
      } else {
        await axios.post("http://localhost:9090/hospitals", form);
      }
      onDone(); // Call the onDone callback to return to the list view
    } catch (err) {
      console.error("Error saving hospital:", err);
      alert("Error saving hospital. Please check your inputs and try again."); // User feedback
    }
    setSaving(false);
  };

  return (
    <Paper sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={onDone}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" ml={1}>
          {isEdit ? "Edit Hospital" : "Add Hospital"}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        {/* Basic Hospital Information */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Basic Information
        </Typography>
        <TextField
          label="Hospital Name"
          value={form.name}
          onChange={(e) => handleField("name", e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Hospital Email"
          value={form.email}
          onChange={(e) => handleField("email", e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => handleField("password", e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.networked}
              onChange={(e) => handleField("networked", e.target.checked)}
            />
          }
          label="Networked"
          sx={{ mt: 1, mb: 2 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Address Information */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Address
        </Typography>
        <TextField
          label="Street"
          value={form.address.street}
          onChange={(e) => handleField("street", e.target.value, "address")}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="City"
          value={form.address.city}
          onChange={(e) => handleField("city", e.target.value, "address")}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="State"
          value={form.address.state}
          onChange={(e) => handleField("state", e.target.value, "address")}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Pincode"
          value={form.address.pincode}
          onChange={(e) => handleField("pincode", e.target.value, "address")}
          fullWidth
          margin="normal"
          required
          inputProps={{ maxLength: 6 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Contact Information */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Contact Information
        </Typography>
        <TextField
          label="Contact Email"
          value={form.contact_info.email}
          onChange={(e) => handleField("email", e.target.value, "contact_info")}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contact Phone"
          value={form.contact_info.phone}
          onChange={(e) => handleField("phone", e.target.value, "contact_info")}
          fullWidth
          margin="normal"
          required
          inputProps={{ maxLength: 10 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* New: Bank Details Information */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Bank Details
        </Typography>
        <TextField
          label="Bank Name"
          value={form.bankDetails.bankName}
          onChange={(e) =>
            handleField("bankName", e.target.value, "bankDetails")
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Account Number"
          value={form.bankDetails.accountNumber}
          onChange={(e) =>
            handleField("accountNumber", e.target.value, "bankDetails")
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="IFSC Code"
          value={form.bankDetails.ifscCode}
          onChange={(e) =>
            handleField("ifscCode", e.target.value, "bankDetails")
          }
          fullWidth
          margin="normal"
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={saving}
          fullWidth
          sx={{ mt: 3 }}
        >
          {isEdit ? "Update Hospital" : "Create Hospital"}
        </Button>
      </form>
    </Paper>
  );
};

export default InsurerEditHospital;
