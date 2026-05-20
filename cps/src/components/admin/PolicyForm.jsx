import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText
} from "@mui/material";

export default function PolicyForm({ open, onClose, onSubmit, initialData, coversList = [] }) {
  const [fields, setFields] = useState({
    name: "",
    description: "",
    covers: [],
    sumAssured: "",
    premium: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFields({
      name: initialData?.name || "",
      description: initialData?.description || "",
      covers: Array.isArray(initialData?.covers)
        ? initialData.covers.map(c => String(c))
        : [],
      sumAssured: initialData?.sumAssured || "",
      premium: initialData?.premium || ""
    });
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const e = {};
    if (!fields.name.trim()) e.name = "Name is required";
    if (!fields.description.trim()) e.description = "Description is required";
    if (!fields.covers.length) e.covers = "At least one cover required";
    if (!fields.sumAssured || isNaN(fields.sumAssured) || Number(fields.sumAssured) <= 0)
      e.sumAssured = "Valid sum assured required";
    if (!fields.premium || isNaN(fields.premium) || Number(fields.premium) <= 0)
      e.premium = "Valid premium required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = key => e => {
    const value = key === "covers" ? e.target.value : e.target.value;
    setFields(f => ({ ...f, [key]: value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      ...fields,
      covers: fields.covers.map(id => String(id)), // store as array of strings
      sumAssured: Number(fields.sumAssured),
      premium: Number(fields.premium),
      id: initialData?.id
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Policy" : "Add New Policy"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Name" value={fields.name} onChange={handleChange("name")} error={!!errors.name} helperText={errors.name} required fullWidth />
          <TextField label="Description" value={fields.description} onChange={handleChange("description")} error={!!errors.description} helperText={errors.description} required fullWidth multiline minRows={5} />
          <FormControl fullWidth error={!!errors.covers}>
            <InputLabel id="covers-label">Covers</InputLabel>
            <Select
              labelId="covers-label"
              multiple
              value={fields.covers}
              onChange={handleChange("covers")}
              renderValue={selected =>
                selected
                  .map(id => coversList.find(c => c.id === id)?.coverName)
                  .filter(Boolean)
                  .join(", ")
              }
            >
              {coversList.map(cover => (
                <MenuItem key={cover.id} value={cover.id}>
                  <Checkbox checked={fields.covers.indexOf(cover.id) > -1} />
                  <ListItemText primary={cover.coverName} />
                </MenuItem>
              ))}
            </Select>
            {errors.covers && <Box sx={{ color: "error.main", fontSize: 12, mt: 0.5 }}>{errors.covers}</Box>}
          </FormControl>
          <TextField label="Sum Assured" value={fields.sumAssured} onChange={handleChange("sumAssured")} error={!!errors.sumAssured} helperText={errors.sumAssured} required fullWidth type="number" />
          <TextField label="Premium" value={fields.premium} onChange={handleChange("premium")} error={!!errors.premium} helperText={errors.premium} required fullWidth type="number" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Save" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}
