import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Stack,
  Typography,
  Chip,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createTrashPickerThunk } from "../../../store/slice/trashPickersSlice";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";

// Initial form state
const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  address: {
    addressLine1: "",
    addressLine2: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
  assignedZone: "",
  areaCovered: [],
  vehicles: [
    {
      vehicleNumber: "",
      type: "",
      capacity: "",
      available: true,
    },
  ],
};

const AddTrashPickerDialog = ({ open, handleClose }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { showMessage } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  // 👉 Clear error when modal is closed from parent
  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle top-level field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };


  // Handle nested address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // Handle adding to areaCovered
  const handleKeyDown = (e, field) => {
    const value = e.target.value.trim();
    if (e.key === "Enter" && value) {
      e.preventDefault();
      setFormData((prev) => {
        if (prev[field].includes(value)) return prev;
        return {
          ...prev,
          [field]: [...prev[field], value],
        };
      });
      e.target.value = "";
    }
  };

  // Remove chip from areaCovered
  const handleRemoveChip = (field, idx) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  // Add a new vehicle entry
  const handleAddVehicle = () => {
    setFormData((prev) => ({
      ...prev,
      vehicles: [
        ...prev.vehicles,
        { vehicleNumber: "", type: "", capacity: "", available: true },
      ],
    }));
  };

  // Handle change in vehicle fields
  const handleVehicleChange = (idx, field, value) => {
    setFormData((prev) => {
      const vehicles = [...prev.vehicles];
      vehicles[idx] = { ...vehicles[idx], [field]: value };
      return { ...prev, vehicles };
    });
  };

  // Submit the form
  // const handleFormSubmit = () => {
  //   setLoading(true);
  //   console.log("Form submitted:", formData);

  //   // Simulate async submission
  //   setTimeout(() => {
  //     setLoading(false);
  //     setFormData(initialFormState);
  //     handleClose();
  //   }, 1000);
  // };

  const handleFormSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showMessage("Please fix the errors in the form", "error");
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const resultAction = await dispatch(createTrashPickerThunk(formData));
      if (createTrashPickerThunk.fulfilled.match(resultAction)) {
        showMessage(resultAction.payload?.message || "Added successfully", "success");
        setFormData(initialFormState);
        handleClose();
      } else {
        showMessage(resultAction.error?.message || "Failed to create picker", "error");
      }
    } catch (error) {
      showMessage(error.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <AddIcon color="primary" />
          <Typography variant="h6">Add New Trash Picker</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Basic Info */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits and max 10 characters
                if (/^\d{0,10}$/.test(value)) {
                  handleInputChange(e);
                }
              }}
              fullWidth
              required
              error={!!errors.phone}
              helperText={errors.phone || "Enter 10 digit phone number"}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}   // 👈 toggle input type
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Address Fields */}
          <Grid item xs={12}>
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={formData.address.addressLine1}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={formData.address.addressLine2}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Street"
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              name="city"
              value={formData.address.city}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              name="state"
              value={formData.address.state}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Zip"
              name="zip"
              value={formData.address.zip}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Country"
              name="country"
              value={formData.address.country}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          {/* Assigned Zone */}
          <Grid item xs={12}>
            <TextField
              label="Assigned Zone"
              name="assignedZone"
              value={formData.assignedZone}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Area Covered */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Area Covered</Typography>
            <TextField
              placeholder="Type area & press Enter"
              fullWidth
              onKeyDown={(e) => handleKeyDown(e, "areaCovered")}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {formData.areaCovered.map((area, idx) => (
                <Chip
                  key={idx}
                  label={area}
                  onDelete={() => handleRemoveChip("areaCovered", idx)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          {/* Vehicles Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Vehicles</Typography>
            <Stack spacing={1}>
              {formData.vehicles.map((v, idx) => (
                <Grid container spacing={1} key={idx}>
                  {["vehicleNumber", "type", "capacity"].map((f, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                      <TextField
                        label={
                          f === "vehicleNumber"
                            ? "Vehicle Number"
                            : f.charAt(0).toUpperCase() + f.slice(1)
                        }
                        type={f === "capacity" ? "number" : "text"}
                        value={v[f]}
                        onChange={(e) =>
                          handleVehicleChange(idx, f, e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
              <Button size="small" onClick={handleAddVehicle}>
                + Add Vehicle
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Adding..." : "Add Picker"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTrashPickerDialog;
