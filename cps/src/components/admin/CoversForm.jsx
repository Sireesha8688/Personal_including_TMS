import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

export default function CoversForm({ open, onClose, onSubmit, initialData }) {
  const [fields, setFields] = useState({
    coverName: "",
    description: "",
    coverAmount: "",
    premium: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFields({
      coverName: initialData?.coverName || "",
      description: initialData?.description || "",
      coverAmount: initialData?.coverAmount || "",
      premium: initialData?.premium || "",
    });
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const e = {};
    if (!fields.coverName.trim()) e.coverName = "Cover Name required";
    if (!fields.description.trim()) e.description = "Description required";
    if (
      !fields.coverAmount ||
      isNaN(fields.coverAmount) ||
      Number(fields.coverAmount) <= 0
    )
      e.coverAmount = "Enter a valid Cover Amount";
    if (!fields.premium || isNaN(fields.premium) || Number(fields.premium) <= 0)
      e.premium = "Enter a valid Premium";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key) => (e) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        ...fields,
        coverAmount: Number(fields.coverAmount),
        premium: Number(fields.premium),
        ...(initialData?.id && { id: initialData.id }),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Cover" : "Add New Cover"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Cover Name"
            value={fields.coverName}
            onChange={handleChange("coverName")}
            error={!!errors.coverName}
            helperText={errors.coverName}
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
            minRows={4}  // Bigger textarea
            maxRows={8}  // Optional max height
          />
          <TextField
            label="Cover Amount"
            value={fields.coverAmount}
            onChange={handleChange("coverAmount")}
            error={!!errors.coverAmount}
            helperText={errors.coverAmount}
            required
            fullWidth
            type="number"
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Premium"
            value={fields.premium}
            onChange={handleChange("premium")}
            error={!!errors.premium}
            helperText={errors.premium}
            required
            fullWidth
            type="number"
            inputProps={{ min: 0 }}
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
