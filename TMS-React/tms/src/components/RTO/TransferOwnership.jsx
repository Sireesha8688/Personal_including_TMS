import React, { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button, Snackbar, Alert,
  FormControlLabel, Checkbox, Stack, IconButton, Dialog, DialogContent,
  MenuItem
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const genderOptions = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other" }
];

const proofOptions = [
  "Aadhaar", "Pan", "Voter ID", "Driving Licence", "Passport"
];

const initialOwnerState = {
  fname: "", lname: "", gender: "", mobileNo: "", landlineNo: "",
  dateOfBirth: "", tempAddr: "", permAddr: "", pincode: "",
  occupation: "", pancardNo: "", addProofName: ""
};

export default function TransferOwnership() {
  const [vehNo, setVehNo] = useState("");
  const [registration, setRegistration] = useState(null);
  const [offences, setOffences] = useState([]);
  const [newOwnerId, setNewOwnerId] = useState("");
  const [isNewOwner, setIsNewOwner] = useState(false);
  const [registeredOwnerId, setRegisteredOwnerId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [newOwnerDetails, setNewOwnerDetails] = useState(initialOwnerState);
  const [imageModal, setImageModal] = useState({ open: false, image: null });

  const getImageType = (base64) => {
    if (!base64) return "jpeg";
    if (base64.startsWith("iVBORw0KGgo")) return "png";
    return "jpeg";
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const fetchRegistrationAndOffences = async () => {
    if (!vehNo) return;
    try {
      const [reg, off] = await Promise.all([
        axios.get(`http://localhost:7777/rto/ownership/details/${vehNo}`),
        axios.get(`http://localhost:7777/rto/transfer-blocking-offences/${vehNo}`)
      ]);
      setRegistration(reg.data);
      setOffences(off.data);
    } catch {
      setSnackbar({ open: true, message: "Failed to fetch vehicle/offences.", severity: "error" });
    }
  };

  const fetchExistingOwner = async () => {
    if (!newOwnerId) {
      return setSnackbar({ open: true, message: "Enter owner ID.", severity: "warning" });
    }
    try {
      const res = await axios.get(`http://localhost:7777/api/owners/${newOwnerId}`);
      setNewOwnerDetails(res.data);
      setRegisteredOwnerId(res.data.ownerId);
      setSnackbar({ open: true, message: "Owner details fetched.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Owner not found.", severity: "error" });
    }
  };

  const clearOffence = async (id) => {
    try {
      await axios.post(`http://localhost:7777/rto/mark-offence-cleared/${id}`);
      setOffences(prev => prev.filter(o => o.offenceDetailId !== id));
      setSnackbar({ open: true, message: `Offence ${id} cleared`, severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to clear offence", severity: "error" });
    }
  };

  const validateOwner = () => {
    const e = {};
    const f = newOwnerDetails;

    if (!f.fname) e.fname = "Required";
    if (!f.lname) e.lname = "Required";
    if (!f.gender) e.gender = "Required";
    if (!f.dateOfBirth) e.dateOfBirth = "Required";
    if (f.mobileNo && f.mobileNo.length !== 10) e.mobileNo = "Must be 10 digits";
    if (f.landlineNo && f.landlineNo.length !== 10) e.landlineNo = "Must be 10 digits";
    if (!f.permAddr) e.permAddr = "Required";
    if (!f.pincode || f.pincode.length !== 6) e.pincode = "Must be 6 digits";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(f.pancardNo)) e.pancardNo = "Invalid PAN format";
    if (!f.addProofName) e.addProofName = "Required";

    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const registerOwner = async () => {
    if (!validateOwner()) return;

    try {
      const res = await axios.post("http://localhost:7777/api/owners", {
        ...newOwnerDetails,
        pincode: Number(newOwnerDetails.pincode)
      });
      setRegisteredOwnerId(res.data.ownerId);
      setSnackbar({ open: true, message: "Owner registered.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Registration failed.", severity: "error" });
    }
  };

  const transferOwnership = async () => {
    const ownerId = registeredOwnerId;
    if (!ownerId) return setSnackbar({ open: true, message: "Register or fetch owner before transferring.", severity: "warning" });
    if (offences.length > 0) return setSnackbar({ open: true, message: "Clear offences before transfer.", severity: "warning" });

    try {
      await axios.post("http://localhost:7777/rto/ownership/transfer-only", null, {
        params: { appNo: registration.appNo, newOwnerId: ownerId },
      });
      setSnackbar({ open: true, message: "Ownership transferred!", severity: "success" });
      // Reset form
      setVehNo(""); setRegistration(null); setOffences([]);
      setNewOwnerDetails(initialOwnerState);
      setRegisteredOwnerId(null); setNewOwnerId(""); setIsNewOwner(false);
    } catch {
      setSnackbar({ open: true, message: "Transfer failed!", severity: "error" });
    }
  };

  return (
    <Box maxWidth={720} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Transfer Vehicle Ownership</Typography>

        <TextField fullWidth label="Vehicle Number" value={vehNo} onChange={e => setVehNo(e.target.value.toUpperCase())} sx={{ mb: 2 }} />
        <Button variant="contained" fullWidth onClick={fetchRegistrationAndOffences}>Fetch Details</Button>

        {registration && (
          <>
            <Box my={2}>
              <Typography><b>Vehicle:</b> {registration.vehicle?.vehName}</Typography>
              <Typography><b>Engine No:</b> {registration.vehicle?.engineNo}</Typography>
              <Typography><b>Current Owner:</b> {registration.owner?.fname} {registration.owner?.lname}</Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 3 }}>🚨 Pending Offences:</Typography>
            {offences?.length === 0 ? (
              <Typography color="green" mt={1}>✅ No offences found.</Typography>
            ) : (
              offences.map(o => (
                <Box key={o.offenceDetailId} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2, my: 2 }}>
                  <Typography><b>ID:</b> {o.offenceDetailId}</Typography>
                  <Typography><b>Type:</b> {o.offence?.offenceType}</Typography>
                  <Typography><b>Date & Time:</b> {o.time && new Date(o.time).toLocaleString()}</Typography>
                  <Typography><b>Place:</b> {o.place}</Typography>
                  <Typography><b>Filed By:</b> {o.filedBy}</Typography>
                  {o.image && (
                    <img
                      src={`data:image/${getImageType(o.image)};base64,${o.image}`}
                      alt="offence"
                      style={{ maxWidth: 120, marginTop: 6, cursor: "pointer", border: "1px solid #777", borderRadius: 6 }}
                      onClick={() => setImageModal({ open: true, image: o.image })}
                    />
                  )}
                  <Button size="small" variant="contained" color="success" sx={{ mt: 1 }} onClick={() => clearOffence(o.offenceDetailId)}>Clear</Button>
                </Box>
              ))
            )}

            <FormControlLabel
              control={<Checkbox checked={isNewOwner} onChange={e => setIsNewOwner(e.target.checked)} />}
              label="Register New Owner?"
              sx={{ mt: 3 }}
            />

            {isNewOwner ? (
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>New Owner Details</Typography>
                <Stack spacing={2}>
                  <TextField label="First Name" value={newOwnerDetails.fname} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, fname: e.target.value })} required error={!!formErrors.fname} helperText={formErrors.fname} />
                  <TextField label="Last Name" value={newOwnerDetails.lname} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, lname: e.target.value })} required error={!!formErrors.lname} helperText={formErrors.lname} />
                  <TextField type="date" label="Date of Birth" value={newOwnerDetails.dateOfBirth} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, dateOfBirth: e.target.value })} InputLabelProps={{ shrink: true }} error={!!formErrors.dateOfBirth} helperText={formErrors.dateOfBirth} />
                  <TextField select label="Gender" value={newOwnerDetails.gender} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, gender: e.target.value })} error={!!formErrors.gender} helperText={formErrors.gender}>
                    {genderOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                  </TextField>
                  <TextField label="Mobile No" value={newOwnerDetails.mobileNo} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, mobileNo: e.target.value.replace(/\D/g, "").slice(0, 10) })} error={!!formErrors.mobileNo} helperText={formErrors.mobileNo} />
                  <TextField label="Landline No" value={newOwnerDetails.landlineNo} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, landlineNo: e.target.value.replace(/\D/g, "").slice(0, 10) })} error={!!formErrors.landlineNo} helperText={formErrors.landlineNo} />
                  <TextField label="Permanent Address" value={newOwnerDetails.permAddr} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, permAddr: e.target.value })} error={!!formErrors.permAddr} helperText={formErrors.permAddr} />
                  <TextField label="Pincode" value={newOwnerDetails.pincode} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} error={!!formErrors.pincode} helperText={formErrors.pincode} />
                  <TextField label="Occupation" value={newOwnerDetails.occupation} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, occupation: e.target.value })} />
                  <TextField label="PAN Card No" value={newOwnerDetails.pancardNo} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, pancardNo: e.target.value.toUpperCase() })} error={!!formErrors.pancardNo} helperText={formErrors.pancardNo} />
                  <TextField select label="Address Proof" value={newOwnerDetails.addProofName} onChange={e => setNewOwnerDetails({ ...newOwnerDetails, addProofName: e.target.value })} error={!!formErrors.addProofName} helperText={formErrors.addProofName}>
                    {proofOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                </Stack>
                <Button variant="outlined" onClick={registerOwner} sx={{ mt: 2 }}>
                  {registeredOwnerId ? "Registered ✅" : "Register Owner"}
                </Button>
              </Box>
            ) : (
              <Box mt={2}>
                <TextField label="Existing Owner ID" fullWidth value={newOwnerId} onChange={e => setNewOwnerId(e.target.value)} />
                <Button sx={{ mt: 1 }} onClick={fetchExistingOwner}>Fetch Owner</Button>
              </Box>
            )}

            <Button variant="contained" color="primary" fullWidth disabled={offences.length > 0 || !registeredOwnerId} onClick={transferOwnership} sx={{ mt: 3 }}>
              Transfer Ownership
            </Button>
          </>
        )}

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
          <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Image Modal */}
        <Dialog open={imageModal.open} onClose={() => setImageModal({ open: false, image: null })} maxWidth="md">
          <DialogContent sx={{ backgroundColor: "#111", p: 0 }}>
            <IconButton sx={{ color: "white", position: "absolute", top: 8, right: 8 }} onClick={() => setImageModal({ open: false, image: null })}>
              <CloseIcon />
            </IconButton>
            {imageModal.image && (
              <img
                src={`data:image/${getImageType(imageModal.image)};base64,${imageModal.image}`}
                alt="offence"
                style={{ width: "100%", maxWidth: 600, display: "block", margin: "auto", borderRadius: 10 }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Box>
  );
}
