import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box,
  Select, MenuItem, InputLabel, FormControl,
  Checkbox, ListItemText
} from "@mui/material";

// Email must end with @suninsurance.ver
const emailRegex = /^[^\s@]+@suninsurance\.ver$/i;
// Password: 1 uppercase, 1 lowercase, 1 number, 1 special
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

export default function VerifiersForm({ open, onClose, onSubmit, initialData, claimTypes }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedClaimTypes, setSelectedClaimTypes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(initialData?.name || "");
    setEmail(initialData?.email || "");
    setPassword(initialData?.password || "");
    setSelectedClaimTypes(initialData?.claimTypesAuthorized || []);
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Verifier Name required";
    if (!email.trim()) e.email = "Email required";
    else if (!emailRegex.test(email)) e.email = "Format: user@suninsurance.ver";
    if (!password) e.password = "Password required";
    else if (!passRegex.test(password)) e.password = "Password: 1 uppercase, 1 lowercase, 1 number, 1 special";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      password,
      claimTypesAuthorized: selectedClaimTypes, // array of IDs
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Verifier" : "Add Verifier"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Verifier Name"
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
            placeholder="user@suninsurance.ver"
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

          <FormControl fullWidth margin="normal">
            <InputLabel id="claim-types-label">Authorized Claim Types</InputLabel>
            <Select
              labelId="claim-types-label"
              multiple
              value={selectedClaimTypes}
              onChange={e => setSelectedClaimTypes(e.target.value)}
              renderValue={(selected) =>
                selected
                  .map(id => claimTypes.find(ct => ct.id === id)?.type)
                  .filter(Boolean)
                  .join(", ")
              }
            >
              {claimTypes.map(ct => (
                <MenuItem key={ct.id} value={ct.id}>
                  <Checkbox checked={selectedClaimTypes.indexOf(ct.id) > -1} />
                  <ListItemText primary={ct.type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Save" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}
