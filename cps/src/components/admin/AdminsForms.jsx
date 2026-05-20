import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";

const emailRegex = /^[^\s@]+@iq\.admin$/i;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

export default function AdminsForm({ open, onClose, onSubmit, initialData }) {
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [errors, setErrors] = useState({});
  useEffect(() => {
    setName(initialData?.name || ""); setEmail(initialData?.email || ""); setPassword(initialData?.password || ""); setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Admin Name required";
    if (!email.trim()) e.email = "Email required";
    else if (!emailRegex.test(email)) e.email = "Format: user@iq.admin";
    if (!password) e.password = "Password required";
    else if (!passRegex.test(password)) e.password = "Password: 1 uppercase, 1 lowercase, 1 number, 1 special";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = () => validate() && onSubmit({ name: name.trim(), email: email.trim(), password });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Admin" : "Add Admin"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField label="Admin Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)}
            error={!!errors.name} helperText={errors.name} required />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)}
            error={!!errors.email} helperText={errors.email} required placeholder="user@iq.admin" />
          <TextField label="Password" fullWidth margin="normal" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!errors.password} helperText={errors.password} required
            placeholder="1 uppercase, 1 lowercase, 1 number, 1 special" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Save" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}
