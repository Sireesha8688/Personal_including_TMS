import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from "@mui/material";

export default function ClaimTypesForm({ open, onClose, onSubmit, initialData }) {
  const [fields, setFields] = useState({ type: "", description: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFields({
      type: initialData?.type || "",
      description: initialData?.description || ""
    });
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const e = {};
    if (!fields.type.trim()) e.type = "Claim type is required";
    if (!fields.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = key => e => setFields(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...fields, id: initialData?.id });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Claim Type" : "Add Claim Type"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Claim Type"
            value={fields.type}
            onChange={handleChange("type")}
            error={!!errors.type}
            helperText={errors.type}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={fields.description}
            onChange={handleChange("description")}
            error={!!errors.description}
            helperText={errors.description}
            required
            fullWidth
            multiline
            minRows={5}
            placeholder="Enter a detailed description of this claim type"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Save" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}
