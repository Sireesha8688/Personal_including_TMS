import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Divider, // Added for visual separation
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const defaultCustomer = {
  name: "",
  email: "",
  password: "",
  aadharcardNumber: "",
  date_of_birth: "", // New field
  gender: "", // New field
  blood_group: "", // New field
  mobile_number: "", // New field
  address: {
    // Nested object
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  },
  bank_account_details: {
    // Nested object
    bank_name: "",
    account_number: "",
    ifsc_code: "",
  },
  policies: [],
};

const InsurerEditCustomer = ({ customer, onDone }) => {
  const isEdit = Boolean(customer && customer.id);
  // Merge defaultCustomer with provided customer data for initial state
  const [form, setForm] = useState({
    ...defaultCustomer,
    ...customer,
    // Ensure nested objects are initialized correctly if 'customer' has them
    address: { ...defaultCustomer.address, ...(customer?.address || {}) },
    bank_account_details: {
      ...defaultCustomer.bank_account_details,
      ...(customer?.bank_account_details || {}),
    },
  });
  const [policies, setPolicies] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:9090/policy")
      .then((res) => setPolicies(res.data))
      .catch((err) => console.error("Error fetching policies:", err));
  }, []);

  // Handler for top-level fields
  const handleFieldChange = (field, value) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  // Handler for nested fields (e.g., address.street, bank_account_details.bank_name)
  const handleNestedFieldChange = (parentField, childField, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [parentField]: {
        ...prevForm[parentField],
        [childField]: value,
      },
    }));
  };

  const handlePolicyChange = (idx, policyId, expiry_date) => {
    setForm((f) => {
      const updated = [...f.policies];
      if (!updated[idx]) updated[idx] = {};
      if (policyId !== undefined) updated[idx].policyId = Number(policyId);
      if (expiry_date !== undefined) updated[idx].expiry_date = expiry_date;
      // Ensure bought_date is correctly set or updated, if it's new, set to current date
      if (!updated[idx].bought_date) {
        updated[idx].bought_date = new Date().toISOString().slice(0, 10);
      }
      return { ...f, policies: updated };
    });
  };

  const handleAddPolicy = () => {
    // Allow adding up to 3 policies as per original logic
    if (form.policies.length < 3)
      setForm((f) => ({
        ...f,
        policies: [
          ...f.policies,
          {
            policyId: "",
            bought_date: new Date().toISOString().slice(0, 10), // Set bought date on add
            expiry_date: "",
          },
        ],
      }));
  };

  const handleRemovePolicy = (idx) => {
    setForm((f) => ({
      ...f,
      policies: f.policies.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Clean up policies before sending: remove empty policyId or expiry_date
      const cleanedForm = {
        ...form,
        policies: form.policies.filter((p) => p.policyId && p.expiry_date),
      };

      if (isEdit) {
        await axios.put(
          `http://localhost:9090/customers/${form.id}`,
          cleanedForm
        );
      } else {
        await axios.post("http://localhost:9090/customers", cleanedForm);
      }
      onDone(); // Call onDone to refresh the list in parent component
    } catch (err) {
      console.error("Error saving customer:", err); // Log error for debugging
      alert("Error saving customer. Please check your inputs."); // Use alert as per original style
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
          {isEdit ? "Edit Customer" : "Add Customer"}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => handleFieldChange("password", e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Aadhar Card Number"
          value={form.aadharcardNumber}
          onChange={(e) =>
            handleFieldChange("aadharcardNumber", e.target.value)
          }
          fullWidth
          margin="normal"
          required
          inputProps={{ maxLength: 12 }}
        />

        {/* New Fields: Personal Information */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle1" gutterBottom>
          Personal Information
        </Typography>
        <TextField
          label="Date of Birth"
          type="date"
          value={form.date_of_birth}
          onChange={(e) => handleFieldChange("date_of_birth", e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Gender"
          value={form.gender}
          onChange={(e) => handleFieldChange("gender", e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField
          label="Blood Group"
          value={form.blood_group}
          onChange={(e) => handleFieldChange("blood_group", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mobile Number"
          value={form.mobile_number}
          onChange={(e) => handleFieldChange("mobile_number", e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 10 }}
        />

        {/* New Fields: Address */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle1" gutterBottom>
          Address
        </Typography>
        <TextField
          label="Street"
          value={form.address.street}
          onChange={(e) =>
            handleNestedFieldChange("address", "street", e.target.value)
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          value={form.address.city}
          onChange={(e) =>
            handleNestedFieldChange("address", "city", e.target.value)
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="State"
          value={form.address.state}
          onChange={(e) =>
            handleNestedFieldChange("address", "state", e.target.value)
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Pincode"
          value={form.address.pincode}
          onChange={(e) =>
            handleNestedFieldChange("address", "pincode", e.target.value)
          }
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 6 }}
        />
        <TextField
          label="Country"
          value={form.address.country}
          onChange={(e) =>
            handleNestedFieldChange("address", "country", e.target.value)
          }
          fullWidth
          margin="normal"
        />

        {/* New Fields: Bank Account Details */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle1" gutterBottom>
          Bank Account Details
        </Typography>
        <TextField
          label="Bank Name"
          value={form.bank_account_details.bank_name}
          onChange={(e) =>
            handleNestedFieldChange(
              "bank_account_details",
              "bank_name",
              e.target.value
            )
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Account Number"
          value={form.bank_account_details.account_number}
          onChange={(e) =>
            handleNestedFieldChange(
              "bank_account_details",
              "account_number",
              e.target.value
            )
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="IFSC Code"
          value={form.bank_account_details.ifsc_code}
          onChange={(e) =>
            handleNestedFieldChange(
              "bank_account_details",
              "ifsc_code",
              e.target.value
            )
          }
          fullWidth
          margin="normal"
        />

        {/* Existing Policies Section */}
        <Divider sx={{ my: 3 }} />
        <Box mt={2} mb={1}>
          <Typography variant="subtitle1">Policies</Typography>
          {form.policies.map((policy, idx) => (
            <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
              <TextField
                select
                label="Policy"
                value={policy.policyId || ""} // Ensure value is controlled
                onChange={(e) =>
                  handlePolicyChange(idx, e.target.value, policy.expiry_date)
                }
                sx={{ minWidth: 180 }}
                required
              >
                {policies.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name || `Policy #${p.id}`}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Expiry Date"
                type="date"
                value={policy.expiry_date || ""}
                onChange={(e) =>
                  handlePolicyChange(idx, policy.policyId, e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <IconButton
                onClick={() => handleRemovePolicy(idx)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          {form.policies.length < 3 && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddPolicy}
              sx={{ mt: 1 }}
            >
              Add Policy
            </Button>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={saving}
          fullWidth
          sx={{ mt: 3 }} // Add some top margin for the submit button
        >
          {isEdit ? "Update Customer" : "Create Customer"}
        </Button>
      </form>
    </Paper>
  );
};

export default InsurerEditCustomer;
