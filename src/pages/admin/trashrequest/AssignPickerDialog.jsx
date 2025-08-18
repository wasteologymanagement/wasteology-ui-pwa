import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Typography,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Box,
    Divider,
    useMediaQuery,
    useTheme,
    Grid,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";

const AssignPickerDialog = ({
    open,
    onClose,
    pickers,
    selectedPicker,
    setSelectedPicker,
    onAssign,
    assignLoading,
    request,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Stack direction="row" spacing={1} alignItems="center">
                    <AssignmentIcon color="primary" />
                    <Typography variant="h6" noWrap>
                        Assign Trash Picker
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent>
                {/* Request Info */}
                {request && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Request Details
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                fontWeight="bold"
                                noWrap
                            >
                                Name: {request.fullName}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="bold"
                                noWrap
                            >
                                Request ID: {request.requestId}
                            </Typography>

                            <Grid container spacing={1} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <CalendarTodayIcon fontSize="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            {request.pickupDate}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <AccessTimeIcon fontSize="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            {request.pickupTime}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <PhoneIcon fontSize="small" />
                                        <Typography variant="body2" color="text.secondary">
                                            {request.mobileNumber}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ mt: 2 }} />
                    </Box>
                )}

                {/* Picker Dropdown */}
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <TextField
                        select
                        label="Select Trash Picker"
                        value={selectedPicker || ""}
                        onChange={(e) => setSelectedPicker(e.target.value)}
                        fullWidth
                        required
                        disabled={assignLoading}
                    >
                        {pickers.length === 0 ? (
                            <MenuItem disabled>
                                <CircularProgress size={20} />
                                <Typography sx={{ ml: 2 }}>Loading pickers...</Typography>
                            </MenuItem>
                        ) : (
                            pickers
                                .filter((picker) => picker.active === true)
                                .map((picker) => (
                                    <MenuItem key={picker.pickerId} value={picker.pickerId}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PersonIcon fontSize="small" />
                                            <Typography noWrap>
                                                {picker.firstName} {picker.lastName}
                                            </Typography>
                                        </Stack>
                                    </MenuItem>
                                ))
                        )}
                    </TextField>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={onClose} color="inherit" disabled={assignLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={onAssign}
                    variant="contained"
                    disabled={!selectedPicker || assignLoading}
                    startIcon={assignLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                    {assignLoading ? "Assigning..." : "Assign Picker"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignPickerDialog;
