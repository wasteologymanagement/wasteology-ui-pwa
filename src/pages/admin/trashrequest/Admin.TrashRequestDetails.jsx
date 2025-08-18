import { Refresh } from "@mui/icons-material";
import { Assignment } from "@mui/icons-material";
import { ArrowBack } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// Status Chip Helper
const getStatusChip = (status) => {
    const statusMap = {
        REQUESTED: { label: "Pickup Requested", color: "info" },
        ASSIGNED: { label: "Assigned to Picker", color: "primary" },
        IN_PROGRESS: { label: "In Progress", color: "warning" },
        COMPLETED: { label: "Completed", color: "success" },
        CANCELLED: { label: "Cancelled", color: "error" },
        FAILED: { label: "Failed", color: "error" },
        RESCHEDULED: { label: "Rescheduled", color: "secondary" },
    };

    const s = statusMap[status] || { label: status, color: "default" };
    return <Chip label={s.label} color={s.color} size="small" />;
};

const AdminTrashRequestDetails = () => {
    const { state } = useLocation(); // Row/Card data
    const { requestId } = useParams();
    const navigate = useNavigate();

    console.log('state : ', state)

    // Group items by type
    const groupedItems = state.items?.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {}) || {};

    if (!state) {
        return (
            <Typography variant="h6" sx={{ p: 3 }}>
                ❌ No request data found. Please go back.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: "background.default",
                minHeight: "100vh",
            }}
        >
            

            {/* Header Section */}
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                    mb={3}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton onClick={() => navigate(-1)} color="primary">
                        <ArrowBack />
                      </IconButton>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Request Details
                      </Typography>
                      {/* <StatusChip status={clientData?.status} /> */}
                    </Stack>
                    {/* <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                        disabled={refreshLoading}
                      >
                        {refreshLoading ? 'Refreshing...' : 'Refresh'}
                      </Button>
                      {clientData?.status === 'PENDING' && (
                        <Button
                          variant="contained"
                          startIcon={<Assignment />}
                          onClick={() => setOpenAssignDialog(true)}
                        >
                          Assign Picker
                        </Button>
                      )}
                    </Stack> */}
                  </Stack>

            {/* Request Info */}
            <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
                <CardContent>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Request ID: {requestId}
                        </Typography>
                        {getStatusChip(state.status)}
                    </Stack>
                </CardContent>
            </Card>

            {/* User + Pickup Info */}
            <Grid container spacing={3}>
                {/* User Info */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                👤 User Info
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Typography>
                                    <b>Name:</b> {state.fullName}
                                </Typography>
                                <Typography>
                                    <b>Mobile:</b> {state.mobileNumber}
                                </Typography>
                                <Typography>
                                    <b>Email:</b> {state.email || "N/A"}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pickup Info */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                🚚 Pickup Info
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Typography>
                                    <b>Date:</b> {state.pickupDate}
                                </Typography>
                                <Typography>
                                    <b>Time:</b> {state.pickupTime}
                                </Typography>
                                <Typography>
                                    <b>Weight:</b> {state.approxWeight} kg
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Address */}
            <Card sx={{ borderRadius: 3, boxShadow: 3, mt:3, mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        🏠 Address
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {/* <Typography>
                        {state.addressId}
                    </Typography> */}
                    <Typography>
                        {state.address}
                    </Typography>
                </CardContent>
            </Card>

            {/* Items */}
            <Card sx={{ mb: 4, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Items in Request
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {Object.keys(groupedItems).length > 0 ? (
                    <Grid container spacing={2}>
                        {Object.entries(groupedItems).map(([type, items]) => (
                            <Grid item xs={12} key={type}>
                                <Box
                                    sx={{
                                        bgcolor: "grey.50",
                                        borderRadius: 2,
                                        // boxShadow: 1,
                                        p: 2,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", mb: 1, color: "primary.main" }}
                                    >
                                        {type}
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {items.map((item) => (
                                            <Grid item xs={12} sm={6} md={4} key={item.itemId}>
                                                <Card
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        bgcolor: "background.paper",
                                                        boxShadow: 1,
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.secondary">
                                                       Trash: {item.displayName || item.type}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Quantity: {item.quantity} {item.unit || ""}
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>No items available</Typography>
                )}
            </Card>

        </Box>
    );
};

export default AdminTrashRequestDetails;
