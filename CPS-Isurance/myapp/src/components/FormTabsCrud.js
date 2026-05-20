import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordRule = ({ isValid, label }) => (
  <ListItem dense>
    <ListItemIcon style={{ minWidth: 30 }}>
      {isValid ? (
        <CheckCircleIcon style={{ color: "green", fontSize: 20 }} />
      ) : (
        <CancelIcon style={{ color: "red", fontSize: 20 }} />
      )}
    </ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
);

const NAVIGATION = [
  {
    segment: "cover",
    title: "Cover Form",
    icon: <EmailIcon />,
  },
  {
    segment: "insurer",
    title: "Add Insurer",
    icon: <EmailIcon />,
  },
  {
    segment: "verifier",
    title: "Add Verifier",
    icon: <PersonIcon />,
  },
];

export default function FormTabsCrud() {
  const [activeForm, setActiveForm] = useState("cover");

  // Cover form state
  const [cover, setCover] = useState({
    coverName: "",
    sumAssured: "",
    premium: "",
    description: "",
  });

  // Insurer form state and validation
  const [insurer, setInsurer] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [insurerErrors, setInsurerErrors] = useState({});
  const [insurerTouched, setInsurerTouched] = useState({});
  const [insurerPopoverAnchor, setInsurerPopoverAnchor] = useState(null);
  const [insurerShowPassword, setInsurerShowPassword] = useState(false);

  // Verifier form state and validation
  const [verifier, setVerifier] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [verifierErrors, setVerifierErrors] = useState({});
  const [verifierTouched, setVerifierTouched] = useState({});
  const [verifierPopoverAnchor, setVerifierPopoverAnchor] = useState(null);
  const [verifierShowPassword, setVerifierShowPassword] = useState(false);

  // Password validation rules (shared)
  const passwordRules = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[@$!%*?&^#()\-_=+{};:,<.>]/.test(password),
  });

  // Email regexes
  const emailRegexInc = /^[^\s@]+@[^\s@]+\.inc$/i;
  const emailRegexVer = /^[^\s@]+@[^\s@]+\.ver$/i;

  // --- Cover Form Handlers ---
  const handleCoverChange = (e) => {
    const { name, value } = e.target;
    setCover((prev) => ({
      ...prev,
      [name]:
        name === "sumAssured" || name === "premium"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const handleCoverSubmit = (e) => {
    e.preventDefault();
    if (!cover.coverName.trim()) {
      alert("Cover Name is required");
      return;
    }
    if (!cover.sumAssured || cover.sumAssured <= 0) {
      alert("Sum Assured must be positive");
      return;
    }
    if (!cover.premium || cover.premium <= 0) {
      alert("Premium must be positive");
      return;
    }
    alert("Cover form submitted successfully");
    console.log("Cover:", cover);
  };

  // --- Insurer Form Handlers ---
  const validateInsurer = () => {
    const errors = {};
    const trimmedEmail = insurer.email.trim();
    const passwordValid = Object.values(passwordRules(insurer.password)).every(Boolean);

    if (!trimmedEmail) errors.email = "Email is required";
    else if (!emailRegexInc.test(trimmedEmail))
      errors.email = "Invalid email. Must end with '.inc'";

    if (!insurer.password) errors.password = "Password is required";
    else if (!passwordValid) errors.password = "Password does not meet all requirements";

    if (!insurer.name.trim()) errors.name = "Name is required";
    else if (insurer.name.trim().length < 2)
      errors.name = "Name must be at least 2 characters";

    setInsurerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (Object.keys(insurerTouched).length > 0) {
      validateInsurer();
      const passwordValid = Object.values(passwordRules(insurer.password)).every(Boolean);
      if (insurerTouched.password && insurer.password && !passwordValid) {
        setInsurerPopoverAnchor(document.getElementById("insurer-password"));
      } else {
        setInsurerPopoverAnchor(null);
      }
    }
  }, [insurer, insurerTouched]);

  const handleInsurerChange = (e) => {
    const { name, value } = e.target;
    setInsurer((prev) => ({ ...prev, [name]: value }));
  };

  const handleInsurerBlur = (e) => {
    const { name } = e.target;
    setInsurerTouched((prev) => ({ ...prev, [name]: true }));
    validateInsurer();
  };

  const handleInsurerSubmit = (e) => {
    e.preventDefault();
    if (validateInsurer()) {
      alert("Insurer added successfully");
      console.log("Insurer:", insurer);
      setInsurerPopoverAnchor(null);
    }
  };

  const toggleInsurerPasswordVisibility = () => {
    setInsurerShowPassword((show) => !show);
  };

  // --- Verifier Form Handlers ---
  const validateVerifier = () => {
    const errors = {};
    const trimmedEmail = verifier.email.trim();
    const passwordValid = Object.values(passwordRules(verifier.password)).every(Boolean);

    if (!trimmedEmail) errors.email = "Email is required";
    else if (!emailRegexVer.test(trimmedEmail))
      errors.email = "Invalid email. Must end with '.ver'";

    if (!verifier.password) errors.password = "Password is required";
    else if (!passwordValid) errors.password = "Password does not meet all requirements";

    if (!verifier.name.trim()) errors.name = "Name is required";
    else if (verifier.name.trim().length < 2)
      errors.name = "Name must be at least 2 characters";

    setVerifierErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (Object.keys(verifierTouched).length > 0) {
      validateVerifier();
      const passwordValid = Object.values(passwordRules(verifier.password)).every(Boolean);
      if (verifierTouched.password && verifier.password && !passwordValid) {
        setVerifierPopoverAnchor(document.getElementById("verifier-password"));
      } else {
        setVerifierPopoverAnchor(null);
      }
    }
  }, [verifier, verifierTouched]);

  const handleVerifierChange = (e) => {
    const { name, value } = e.target;
    setVerifier((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifierBlur = (e) => {
    const { name } = e.target;
    setVerifierTouched((prev) => ({ ...prev, [name]: true }));
    validateVerifier();
  };

  const handleVerifierSubmit = (e) => {
    e.preventDefault();
    if (validateVerifier()) {
      alert("Verifier added successfully");
      console.log("Verifier:", verifier);
      setVerifierPopoverAnchor(null);
    }
  };

  const toggleVerifierPasswordVisibility = () => {
    setVerifierShowPassword((show) => !show);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5, px: 2 }}>
      <Grid container spacing={2} sx={{ mb: 4, justifyContent: "center" }}>
        {NAVIGATION.map(({ segment, title, icon }) => (
          <Grid item key={segment}>
            <Button
              variant={activeForm === segment ? "contained" : "outlined"}
              color="primary"
              startIcon={icon}
              onClick={() => setActiveForm(segment)}
              sx={{ minWidth: 140 }}
            >
              {title}
            </Button>
          </Grid>
        ))}
      </Grid>

      {activeForm === "cover" && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Cover Form
          </Typography>
          <Box component="form" onSubmit={handleCoverSubmit} noValidate>
            <TextField
              label="Cover Name"
              name="coverName"
              value={cover.coverName}
              onChange={handleCoverChange}
              fullWidth
              margin="normal"
              required
              placeholder="e.g., Fracture"
            />
            <TextField
              label="Sum Assured"
              name="sumAssured"
              type="number"
              value={cover.sumAssured}
              onChange={handleCoverChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 0 }}
              placeholder="e.g., 3000"
            />
            <TextField
              label="Premium"
              name="premium"
              type="number"
              value={cover.premium}
              onChange={handleCoverChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 0 }}
              placeholder="e.g., 200"
            />
            <TextField
              label="Description"
              name="description"
              value={cover.description}
              onChange={handleCoverChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              placeholder="Brief description of the cover"
            />
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Submit Cover
            </Button>
          </Box>
        </Paper>
      )}

      {activeForm === "insurer" && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add Insurer
          </Typography>
          <Box component="form" onSubmit={handleInsurerSubmit} noValidate>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={insurer.email}
              onChange={handleInsurerChange}
              onBlur={handleInsurerBlur}
              fullWidth
              margin="normal"
              required
              placeholder="example@company.inc"
              error={Boolean(insurerErrors.email) && Boolean(insurerTouched.email)}
              helperText={insurerTouched.email ? insurerErrors.email : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="insurer-password"
              label="Password"
              name="password"
              type={insurerShowPassword ? "text" : "password"}
              value={insurer.password}
              onChange={handleInsurerChange}
              onBlur={handleInsurerBlur}
              fullWidth
              margin="normal"
              required
              placeholder="At least 8 chars, uppercase, number, special char"
              error={Boolean(insurerErrors.password) && Boolean(insurerTouched.password)}
              helperText={insurerTouched.password ? insurerErrors.password : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={insurerShowPassword ? "Hide password" : "Show password"}
                      onClick={toggleInsurerPasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {insurerShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              aria-describedby="insurer-password-popover"
            />
            <Popover
              id="insurer-password-popover"
              open={Boolean(insurerPopoverAnchor)}
              anchorEl={insurerPopoverAnchor}
              onClose={() => setInsurerPopoverAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              disableRestoreFocus
              sx={{ pointerEvents: "auto" }}
            >
              <Box sx={{ p: 2, maxWidth: 300 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Password must contain:
                </Typography>
                <List dense>
                  <PasswordRule isValid={passwordRules(insurer.password).length} label="At least 8 characters" />
                  <PasswordRule isValid={passwordRules(insurer.password).uppercase} label="At least one uppercase letter (A-Z)" />
                  <PasswordRule isValid={passwordRules(insurer.password).lowercase} label="At least one lowercase letter (a-z)" />
                  <PasswordRule isValid={passwordRules(insurer.password).number} label="At least one number (0-9)" />
                  <PasswordRule isValid={passwordRules(insurer.password).specialChar} label="At least one special character (#, @, !, etc.)" />
                </List>
              </Box>
            </Popover>
            <TextField
              label="Name"
              name="name"
              value={insurer.name}
              onChange={handleInsurerChange}
              onBlur={handleInsurerBlur}
              fullWidth
              margin="normal"
              required
              placeholder="Your full name"
              error={Boolean(insurerErrors.name) && Boolean(insurerTouched.name)}
              helperText={insurerTouched.name ? insurerErrors.name : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              disabled={Object.keys(insurerErrors).length > 0}
            >
              Add Insurer
            </Button>
          </Box>
        </Paper>
      )}

      {activeForm === "verifier" && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add Verifier
          </Typography>
          <Box component="form" onSubmit={handleVerifierSubmit} noValidate>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={verifier.email}
              onChange={handleVerifierChange}
              onBlur={handleVerifierBlur}
              fullWidth
              margin="normal"
              required
              placeholder="example@company.ver"
              error={Boolean(verifierErrors.email) && Boolean(verifierTouched.email)}
              helperText={verifierTouched.email ? verifierErrors.email : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="verifier-password"
              label="Password"
              name="password"
              type={verifierShowPassword ? "text" : "password"}
              value={verifier.password}
              onChange={handleVerifierChange}
              onBlur={handleVerifierBlur}
              fullWidth
              margin="normal"
              required
              placeholder="At least 8 chars, uppercase, number, special char"
              error={Boolean(verifierErrors.password) && Boolean(verifierTouched.password)}
              helperText={verifierTouched.password ? verifierErrors.password : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={verifierShowPassword ? "Hide password" : "Show password"}
                      onClick={toggleVerifierPasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {verifierShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              aria-describedby="verifier-password-popover"
            />
            <Popover
              id="verifier-password-popover"
              open={Boolean(verifierPopoverAnchor)}
              anchorEl={verifierPopoverAnchor}
              onClose={() => setVerifierPopoverAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              disableRestoreFocus
              sx={{ pointerEvents: "auto" }}
            >
              <Box sx={{ p: 2, maxWidth: 300 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Password must contain:
                </Typography>
                <List dense>
                  <PasswordRule isValid={passwordRules(verifier.password).length} label="At least 8 characters" />
                  <PasswordRule isValid={passwordRules(verifier.password).uppercase} label="At least one uppercase letter (A-Z)" />
                  <PasswordRule isValid={passwordRules(verifier.password).lowercase} label="At least one lowercase letter (a-z)" />
                  <PasswordRule isValid={passwordRules(verifier.password).number} label="At least one number (0-9)" />
                  <PasswordRule isValid={passwordRules(verifier.password).specialChar} label="At least one special character (#, @, !, etc.)" />
                </List>
              </Box>
            </Popover>
            <TextField
              label="Name"
              name="name"
              value={verifier.name}
              onChange={handleVerifierChange}
              onBlur={handleVerifierBlur}
              fullWidth
              margin="normal"
              required
              placeholder="Your full name"
              error={Boolean(verifierErrors.name) && Boolean(verifierTouched.name)}
              helperText={verifierTouched.name ? verifierErrors.name : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              disabled={Object.keys(verifierErrors).length > 0}
            >
              Add Verifier
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
