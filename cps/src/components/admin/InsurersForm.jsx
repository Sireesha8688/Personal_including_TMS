import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";

// Email must end with @suninsurance.ins
const emailRegex = /^[^\s@]+@suninsurance\.ins$/i;
// Password: 1 uppercase, 1 lowercase, 1 number, 1 special
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

export default function InsurersForm({ open, onClose, onSubmit, initialData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(initialData?.name || "");
    setEmail(initialData?.email || "");
    setPassword(initialData?.password || "");
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Insurer Name required";
    if (!email.trim()) e.email = "Email required";
    else if (!emailRegex.test(email))
      e.email = "Email must be in the format user@suninsurance.ins";
    if (!password) e.password = "Password required";
    else if (!passRegex.test(password))
      e.password = "Password: 1 uppercase, 1 lowercase, 1 number, 1 special";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        name: name.trim(),
        email: email.trim(),
        password
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Insurer" : "Add Insurer"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Insurer Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            placeholder="user@suninsurance.ins"
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            required
            placeholder="1 uppercase, 1 lowercase, 1 number, 1 special"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
