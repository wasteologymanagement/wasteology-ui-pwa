import React, { useEffect, useMemo, useState } from 'react'
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    Grid,
    Tooltip,
} from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, Refresh } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, getAllTrashRequests } from '../../../store/slice/trashRequestSlice';

// Status Icons
import {
    HourglassTop,
    AssignmentTurnedIn,
    DirectionsRun,
    CheckCircle,
    Cancel,
    Error,
    Autorenew,
    CalendarToday,
    AccessTime,
    Phone,
    Scale,
    Assignment
} from '@mui/icons-material';
import { ActionsColumn } from "../../../components/ActionsColumn";
import { useSnackbar } from "../../../components/SnackbarProvider";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import AssignPickerDialog from './AssignPickerDialog';
import { getAllActiveTrashPickers } from '../../../service/apiServices/trashPickersService';
import { AssignmentInd } from '@mui/icons-material';

const TABS = [
    { label: "All", value: "ALL" },
    { label: "Active", value: true },
    { label: "Inactive", value: false },
];

const AdminTrashRequest = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmallDesktop = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [tabIndex, setTabIndex] = useState(0);
    const { showMessage } = useSnackbar();
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        action: null, // 'delete' | 'deactivate' | 'activate'
        item: null
    });
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [selectedPicker, setSelectedPicker] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null); // holds the full row data
    const [pickers, setPickers] = useState([]); // you probably load this from your backend
    const [loadingPickers, setLoadingPickers] = useState(false);


    const { requests, loading, error, message } = useSelector(
        (state) => state.trashRequest
    );

    useEffect(() => {
        if (message) {
            showMessage(message || "Cleared", "success");
            dispatch(clearMessage());
        }
    }, [message, dispatch]);


    // Fetch initial data
    useEffect(() => {
        dispatch(getAllTrashRequests());
    }, [dispatch]);

    useEffect(() => {
        if (openAssignDialog) {
            fetchPickers();
        }
    }, [openAssignDialog]);


    const fetchPickers = async () => {
        try {
            setLoadingPickers(true);
            const res = await getAllActiveTrashPickers();
            console.log(" trash picker list : ", res)
            setPickers(res.data);
        } catch (err) {
            console.error("Failed to load pickers:", err);
        } finally {
            setLoadingPickers(false);
        }
    };

    // Filter rows when search query changes
    const filteredTrashRequest = useMemo(() => {
        const currentTab = TABS[tabIndex].value;

        return requests
            .filter((request) => {
                if (currentTab === "ALL") return true;
                return request.active === currentTab;
            })
            .filter((request) => {
                const query = searchQuery.toLowerCase();
                return (
                    request.firstName?.toLowerCase().includes(query) ||
                    request.lastName?.toLowerCase().includes(query) ||
                    request.phone?.toLowerCase().includes(query)
                );
            });
    }, [requests, searchQuery, tabIndex]);

    const handleRefresh = async () => {
        await dispatch(getAllTrashRequests());
    };

    // Navigate to details
    const handleNavigate = (req) => {
        navigate(`/app/admin/trash-request/details/${req.requestId}`, { state: req });
    };

    const handleAssignPicker = async () => {
        if (!selectedPicker || !selectedRequest) return;

        try {
            setAssignLoading(true);

            // Example: Replace with your actual API call
            // await assignPickerToRequest(selectedRequest.requestId, selectedPicker);

            // Success handling
            setOpenAssignDialog(false);
            setSelectedPicker("");
            setSelectedRequest(null);
            // Optionally refresh data
            console.log("assigned....")
            showMessage("Assigned successfully", "success");
        } catch (err) {
            console.error("Assignment failed:", err);
            // Show error via Snackbar or Alert
        } finally {
            setAssignLoading(false);
        }
    };


    // DataGrid Columns
    const Columns = [
        { field: "requestId", headerName: "Id", flex: 0.1 },
        { field: "firstName", headerName: "First Name", flex: 0.4 },
        { field: "lastName", headerName: "Last Name", flex: 0.4 },
        { field: "mobileNumber", headerName: "Mobile No.", flex: 0.3 },
        {
            field: "pickupDate", headerName: "Pickup Date", flex: 0.3,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >

                    <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">{params.value}</Typography>
                    </Stack>
                </Box>
            ),
        },
        {
            field: "pickupTime", headerName: "Pickup Time", flex: 0.3, align: "center",
            headerAlign: "center", renderCell: (params) => (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >

                    <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2">{params.value}</Typography>
                    </Stack>
                </Box>
            ),
        },
        {
            field: "approxWeight", headerName: "Apr. Weight (kg)", flex: 0.3, align: "center",
            headerAlign: "center",
        },
        {
            field: "status",
            headerName: "Status",
            align: "center",
            headerAlign: "center",
            flex: 0.5,
            renderCell: (params) => getStatusChip(params.value),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.4,
            align: "center",
            headerAlign: "center",
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAssignDialog(params.row)
                    }}
                >
                    Assign Picker
                </Button>
            ),
        }
    ];

    // Status Chip Component
    const getStatusChip = (status) => {
        switch (status) {
            case "REQUESTED":
                return (
                    <Chip label="Pickup Requested" color="info" icon={<HourglassTop />} variant="outlined" />
                    // <Chip label="REQ" color="info" icon={<HourglassTop />} variant="outlined" />
                );
            case "ASSIGNED":
                return (
                    // <Chip label="ASN" color="primary" icon={<AssignmentTurnedIn />} />
                    <Chip label="Assigned" color="primary" icon={<AssignmentTurnedIn />} />
                );
            case "IN_PROGRESS":
                return (
                    // <Chip label="INP" color="warning" icon={<DirectionsRun />} />
                    <Chip label="In Progress" color="warning" icon={<DirectionsRun />} />
                );
            case "COMPLETED":
                return (
                    // <Chip label="CMP" color="success" icon={<CheckCircle />} />
                    <Chip label="Completed" color="success" icon={<CheckCircle />} />
                );
            case "CANCELLED":
                return (
                    // <Chip label="CNL" color="error" icon={<Cancel />} variant="outlined" />
                    <Chip label="Cancelled" color="error" icon={<Cancel />} variant="outlined" />
                );
            case "FAILED":
                return (
                    // <Chip label="FLD" sx={{ backgroundColor: "#ff4d4f", color: "#fff" }} icon={<Error />} />
                    <Chip label="Failed" sx={{ backgroundColor: "#ff4d4f", color: "#fff" }} icon={<Error />} />
                );
            case "RESCHEDULED":
                return (
                    // <Chip label="RSD" sx={{ backgroundColor: "#ffa726", color: "#fff" }} icon={<Autorenew />} />
                    <Chip label="Rescheduled" sx={{ backgroundColor: "#ffa726", color: "#fff" }} icon={<Autorenew />} />
                );
            default:
                return <Chip label="Unknown" variant="outlined" />;
        }
    };

    const handleOpenAssignDialog = (rowData) => {
        setSelectedRequest(rowData);         // Save the full row data
        setSelectedPicker("");               // Reset previously selected picker
        setOpenAssignDialog(true);           // Open dialog
    };

    const handleCloseAssignDialog = () => {
        setOpenAssignDialog(false);
        setSelectedPicker(""); // ✅ Reset picker selection
    };



    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header Section */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={2}
                mb={3}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Trash Requests
                </Typography>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ width: { xs: "100%", md: "auto" } }}
                >
                    <TextField
                        size="small"
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: { xs: "100%", sm: 200 } }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                        disabled={loading}
                        sx={{ minWidth: { xs: "100%", sm: 120 } }}
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </Button>
                </Stack>
            </Stack>

            {/* Error or Loading */}
            {loading && <CircularProgress sx={{ display: "block", m: "20px auto" }} />}
            {error && <Alert severity="error">{error}</Alert>}

            {isMobileOrTablet ? (
                // 📱 Card Layout for Mobile / Tablet
                <Stack spacing={3} sx={{ mb: 3 }}>
                    {filteredTrashRequest
                        .filter((req) =>
                            req.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((req) => (
                            <Card
                                key={req.requestId}
                                variant="outlined"
                                onClick={() => handleNavigate(req)}
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    p: 2,
                                    transition: "0.3s",
                                    cursor: "pointer",
                                    "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
                                }}
                            >
                                <CardContent>
                                    {/* Header: Avatar + Name + Actions */}
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        justifyContent="space-between"
                                        alignItems={{ xs: "flex-start", sm: "center" }}
                                        spacing={2}
                                        sx={{ mb: 2 }}
                                    >
                                        {/* Avatar + Name */}
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold" }}>
                                                {req.fullName?.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {req.fullName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Request ID: {req.requestId}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        {/* Actions: Assign Button + Status Chip */}
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {/* Show Assign button only if not assigned */}
                                            {/* {req.status !== "ASSIGNED" && (
                                                <Tooltip title="Assign this request to a trash picker" arrow>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                        startIcon={<AssignmentInd />}
                                                        onClick={() => handleOpenAssignDialog(req)}
                                                        sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                                                    >
                                                        Assign Picker
                                                    </Button>
                                                </Tooltip>
                                            )} */}

                                            {/* Status Chip */}
                                            {getStatusChip(req.status)}
                                        </Stack>
                                    </Stack>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Request Details */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <CalendarToday fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {req.pickupDate}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <AccessTime fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {req.pickupTime}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Phone fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {req.mobileNumber}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Scale fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {req.approxWeight} kg
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ mt: 2, mb: 1 }} />

                                    {/* Actions: Assign Button + Status Chip */}
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center" // Centers horizontally
                                        sx={{ width: "100%", mt: 2 }} // Optional: adds spacing from top
                                    >
                                        {req.status === "REQUESTED" && (
                                            <Tooltip title="Assign this request to a trash picker" arrow>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="primary"
                                                    startIcon={<AssignmentInd />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenAssignDialog(req)
                                                    }}
                                                    sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                                                >
                                                    Assign Picker
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </Stack>

                                </CardContent>

                            </Card>
                        ))}
                </Stack>
            ) : (
                // 💻 DataGrid Layout for Desktop
                <Box sx={{ overflowX: "auto" }}>
                    <Box sx={{ minWidth: { xs: "600px", sm: "800px", md: "1000px" } }}>
                        <DataGrid
                            rows={requests.filter((req) =>
                                req.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                            )}
                            columns={Columns}
                            getRowId={(row) => row.requestId}
                            onRowClick={(params) => handleNavigate(params.row)}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                                sorting: { sortModel: [{ field: "pickupDate", sort: "desc" }] },
                            }}
                            pageSizeOptions={[10, 25, 50]}
                            disableRowSelectionOnClick
                            components={{
                                NoRowsOverlay: () => (
                                    <Stack height="100%" alignItems="center" justifyContent="center">
                                        <Typography variant="body1" color="text.secondary">
                                            No trash requests found
                                        </Typography>
                                    </Stack>
                                ),
                            }}
                            sx={{
                                "& .MuiDataGrid-cell": { fontSize: "0.9rem" },
                                "& .MuiDataGrid-columnHeaders": { fontWeight: "bold" },
                            }}
                        />
                    </Box>
                </Box>
            )}

            <AssignPickerDialog
                open={openAssignDialog}
                onClose={handleCloseAssignDialog}
                pickers={pickers}
                selectedPicker={selectedPicker}
                setSelectedPicker={setSelectedPicker}
                onAssign={handleAssignPicker}
                assignLoading={assignLoading}
                request={selectedRequest}
            />



        </Box>
    );
};

export default AdminTrashRequest;
