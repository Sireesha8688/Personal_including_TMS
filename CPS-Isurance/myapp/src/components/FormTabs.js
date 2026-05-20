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
    <ListItemIcon sx={{ minWidth: 30 }}>
      {isValid ? (
        <CheckCircleIcon sx={{ color: "green", fontSize: 20 }} />
      ) : (
        <CancelIcon sx={{ color: "red", fontSize: 20 }} />
      )}
    </ListItemIcon>
    <ListItemText primary={label} />
  </ListItem>
);

function CoverForm() {
  const [cover, setCover] = useState({
    coverName: "",
    sumAssured: "",
    premium: "",
    description: "",
  });

  const handleChange = (e) => {
    setCover({ ...cover, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cover submitted:", cover);
  };

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Cover Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Cover Name"
          name="coverName"
          value={cover.coverName}
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
  );
}

function AddInsurerForm() {
  const [insurer, setInsurer] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [touched, setTouched] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Email regex: must end with .inc
  const emailRegex = /^[^\s@]+@[^\s@]+\.inc$/i;

  // Password rules regexes
  const rules = {
    length: insurer.password.length >= 8,
    uppercase: /[A-Z]/.test(insurer.password),
    lowercase: /[a-z]/.test(insurer.password),
    number: /\d/.test(insurer.password),
    specialChar: /[@$!%*?&^#()\-_=+{};:,<.>]/.test(insurer.password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const validate = () => {
    const newErrors = {};

    const trimmedEmail = insurer.email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email =
        "Invalid email. Must be a valid email and end with '.inc'";
    }

    if (!insurer.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (!insurer.name) {
      newErrors.name = "Name is required";
    } else if (insurer.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Show popover only if password field touched and invalid and not empty
  useEffect(() => {
    if (touched.password && insurer.password.length > 0 && !isPasswordValid) {
      setAnchorEl(document.getElementById("insurer-password"));
    } else {
      setAnchorEl(null);
    }
  }, [insurer.password, touched.password, isPasswordValid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInsurer((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Insurer submitted:", insurer);
      setAnchorEl(null);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const open = Boolean(anchorEl);
  const id = open ? "password-popover" : undefined;

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Insurer
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={insurer.email}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          margin="normal"
          required
          placeholder="example@company.inc"
          error={Boolean(errors.email) && Boolean(touched.email)}
          helperText={touched.email ? errors.email : ""}
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
          type={showPassword ? "text" : "password"}
          value={insurer.password}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          margin="normal"
          required
          placeholder="At least 8 chars, uppercase, number, special char"
          error={Boolean(errors.password) && Boolean(touched.password)}
          helperText={touched.password ? errors.password : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={handleClickShowPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          aria-describedby={id}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          disableRestoreFocus
          sx={{ pointerEvents: "auto" }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Password must contain:
            </Typography>
            <List dense>
              <PasswordRule
                isValid={rules.length}
                label="At least 8 characters"
              />
              <PasswordRule
                isValid={rules.uppercase}
                label="At least one uppercase letter (A-Z)"
              />
              <PasswordRule
                isValid={rules.lowercase}
                label="At least one lowercase letter (a-z)"
              />
              <PasswordRule isValid={rules.number} label="At least one number (0-9)" />
              <PasswordRule
                isValid={rules.specialChar}
                label="At least one special character (#, @, !, etc.)"
              />
            </List>
          </Box>
        </Popover>
        <TextField
          label="Name"
          name="name"
          value={insurer.name}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          margin="normal"
          required
          placeholder="Your full name"
          error={Boolean(errors.name) && Boolean(touched.name)}
          helperText={touched.name ? errors.name : ""}
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
          disabled={Object.keys(errors).length > 0}
        >
          Add Insurer
        </Button>
      </Box>
    </Paper>
  );
}

function AddVerifierForm() {
  const [verifier, setVerifier] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [touched, setTouched] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Email regex: must end with .ver
  const emailRegex = /^[^\s@]+@[^\s@]+\.ver$/i;

  const rules = {
    length: verifier.password.length >= 8,
    uppercase: /[A-Z]/.test(verifier.password),
    lowercase: /[a-z]/.test(verifier.password),
    number: /\d/.test(verifier.password),
    specialChar: /[@$!%*?&^#()\-_=+{};:,<.>]/.test(verifier.password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const validate = () => {
    const newErrors = {};

    const trimmedEmail = verifier.email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email =
        "Invalid email. Must be a valid email and end with '.ver'";
    }

    if (!verifier.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (!verifier.name) {
      newErrors.name = "Name is required";
    } else if (verifier.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (touched.password && verifier.password.length > 0 && !isPasswordValid) {
      setAnchorEl(document.getElementById("verifier-password"));
    } else {
      setAnchorEl(null);
    }
  }, [verifier.password, touched.password, isPasswordValid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVerifier((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Verifier submitted:", verifier);
      setAnchorEl(null);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const open = Boolean(anchorEl);
  const id = open ? "password-popover" : undefined;

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Verifier
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={verifier.email}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          margin="normal"
          required
          placeholder="example@company.ver"
          error={Boolean(errors.email) && Boolean(touched.email)}
          helperText={touched.email ? errors.email : ""}
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
          type={showPassword ? "text" : "password"}
          value={verifier.password}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          margin="normal"
          required
          placeholder="At least 8 chars, uppercase, number, special char"
          error={Boolean(errors.password) && Boolean(touched.password)}
          helperText={touched.password ? errors.password : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={handleClickShowPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          aria-describedby={id}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          disableRestoreFocus
          sx={{ pointerEvents: "auto" }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Password must contain:
            </Typography>
            <List dense>
              <PasswordRule
                isValid={rules.length}
                label="At least 8 characters"
              />
              <PasswordRule
                isValid={rules.uppercase}
                label="At least one uppercase letter (A-Z)"
              />
              <PasswordRule
                isValid={rules.lowercase}
                label="At least one lowercase letter (a-z)"
              />
              <PasswordRule isValid={rules.number} label="At least one number (0-9)" />
              <PasswordRule
                isValid={rules.specialChar}
                label="At least one special character (#, @, !, etc.)"
              />
            </List>
          </Box>
        </Popover>
        <TextField
          label="Name"
          name="name"
          value={verifier.name}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          margin="normal"
          required
          placeholder="Your full name"
          error={Boolean(errors.name) && Boolean(touched.name)}
          helperText={touched.name ? errors.name : ""}
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
          disabled={Object.keys(errors).length > 0}
        >
          Add Verifier
        </Button>
      </Box>
    </Paper>
  );
}

export default function FormTabs() {
  const [activeForm, setActiveForm] = useState("cover");

  const buttonStyle = {
    marginRight: 1,
    minWidth: 140,
  };

  return (
    <Box sx={{ maxWidth: 650, mx: "auto", mt: 5, px: 2 }}>
      <Grid container spacing={2} sx={{ mb: 4, justifyContent: "center" }}>
        <Grid item>
          <Button
            variant={activeForm === "cover" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveForm("cover")}
            sx={buttonStyle}
          >
            Cover Form
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={activeForm === "insurer" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveForm("insurer")}
            sx={buttonStyle}
          >
            Add Insurer
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={activeForm === "verifier" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveForm("verifier")}
            sx={buttonStyle}
          >
            Add Verifier
          </Button>
        </Grid>
      </Grid>

      <Box>
        {activeForm === "cover" && <CoverForm />}
        {activeForm === "insurer" && <AddInsurerForm />}
        {activeForm === "verifier" && <AddVerifierForm />}
      </Box>
    </Box>
  );
}
