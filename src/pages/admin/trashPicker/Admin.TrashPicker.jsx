import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Typography,
    Button,
    Stack,
    TextField,
    InputAdornment,
    useMediaQuery,
    useTheme,
    Tabs,
    Tab,
    Grid,
    CircularProgress,
    Alert,
    Chip,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Block as BlockIcon,
    Restore as RestoreIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
    activateTrashPickerThunk,
    permanentDeleteTrashPickerThunk,
    fetchTrashPickersThunk,
    softDeleteTrashPickerThunk,
    clearMessage,
    // other actions if needed
} from "../../../store/slice/trashPickersSlice";
import { DataGrid } from "@mui/x-data-grid";
import { ActionsColumn } from "../../../components/ActionsColumn";
import { useSnackbar } from "../../../components/SnackbarProvider";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import AddTrashPickerDialog from "./AddTrashPickerDialog";

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
            capacity: 0,
            available: true,
        },
    ],
};


const TABS = [
    { label: "All", value: "ALL" },
    { label: "Active", value: true },
    { label: "Inactive", value: false },
];

const AdminTrashPicker = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { trashPickers, loading, error, message } = useSelector((state) => state.trashPickers);
    const { showMessage } = useSnackbar();
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        action: null, // 'delete' | 'deactivate' | 'activate'
        item: null
    });

    useEffect(() => {
        if (message) {
            showMessage(message || "Cleared", "success");
            dispatch(clearMessage());
        }
    }, [message, dispatch]);


    const [searchQuery, setSearchQuery] = useState("");
    const [tabIndex, setTabIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
  
    useEffect(() => {
        dispatch(fetchTrashPickersThunk());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleRefresh = () => dispatch(fetchTrashPickersThunk());

    const filteredTrashPickers = useMemo(() => {
        const currentTab = TABS[tabIndex].value;

        return trashPickers
            .filter((picker) => {
                if (currentTab === "ALL") return true;
                return picker.active === currentTab;
            })
            .filter((picker) => {
                const query = searchQuery.toLowerCase();
                return (
                    picker.firstName?.toLowerCase().includes(query) ||
                    picker.lastName?.toLowerCase().includes(query) ||
                    picker.email?.toLowerCase().includes(query) ||
                    picker.phone?.toLowerCase().includes(query)
                );
            });
    }, [trashPickers, searchQuery, tabIndex]);


    const handleEditClick = (row) => {
        console.log('edit data : ', row)

        setFormData(row);
        setEditMode(true);
        setOpen(true);
    };

    const handleSoftDelete = async (id) => {
        try {
            await dispatch(softDeleteTrashPickerThunk(id)).unwrap();
            showMessage("Item deleted successfully", "success");
        } catch (error) {
            showMessage(error.message || "Failed to delete item", "error");
        }
    };


    const handlePermanentDelete = async (id) => {
        try {
            await dispatch(permanentDeleteTrashPickerThunk(id)).unwrap();
            showMessage("Item permanently deleted", "success");
        } catch (error) {
            showMessage(error.message || "Failed to permanently delete", "error");
        }
    };

    const handleActivate = async (id) => {
        console.log("Activating picker with ID:", id);
        try {
            const response = await dispatch(activateTrashPickerThunk(id))
            console.log("Activation response:", response);
            showMessage(response?.message || "Activated successfully", "success");
        } catch (error) {
            console.error("Activation error:", error);
            showMessage(error?.message || "Failed to activate", "error");
        }
    };


    const columns = [

        { field: "pickerId", headerName: "Id", flex: 0.3, align: "center", headerAlign: "center" },
        { field: "userId", headerName: "UserId", flex: 0.4, align: "center", headerAlign: "center" },
        {
            field: "firstName",
            headerName: "First Name",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
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
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* <PersonIcon color="primary" fontSize="small" /> */}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{params.value}</Typography>
                    </Stack>
                </Box>
            )

        },
        {
            field: "lastName",
            headerName: "Last Name",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
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
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {params.value}
                    </Typography>
                </Box>
            )

        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.8,
            minWidth: 120,
            headerAlign: "center",
            align: "center",
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
                    <Chip
                        label={params.value}
                        color={params.value === "ACTIVE" ? "success" : "default"}
                        variant="filled"
                        size="small"
                        sx={{
                            textTransform: "capitalize",
                            fontWeight: 500,
                        }}
                    />
                </Box>
            )

        },
        {
            field: "mobileNumber",
            headerName: "Mobile Number",
            flex: 1,
            minWidth: 150,
            headerAlign: "center",
            align: "center",
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
                        <PhoneIcon color="primary" fontSize="small" />
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                cursor: "pointer",
                                textDecoration: "underline",
                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `tel:${params.value}`;
                            }}
                        >
                            {params.value}
                        </Typography>
                    </Stack>
                </Box>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.5,
            align: "center",
            headerAlign: "center",
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <ActionsColumn
                    params={params}
                    handleSoftDelete={handleSoftDelete}
                    handlePermanentDelete={handlePermanentDelete}
                    handleActivate={handleActivate}
                />
            ),
        }

    ]

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, mb: { xs: "50px", sm: 0 } }}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={2}
                mb={3}
            >
                <Typography variant="h4" fontWeight="bold">
                    Trash Pickers Management
                </Typography>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ width: { xs: "100%", md: "auto" } }}
                >
                    <TextField
                        size="small"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: { xs: "100%", sm: 200 } }}
                    />

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        disabled={loading}
                        sx={{ minWidth: { xs: "100%", sm: 120 } }}
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                        sx={{ minWidth: { xs: "100%", sm: 150 }, borderRadius: 2 }}
                    >
                        Add Picker
                    </Button>
                </Stack>
            </Stack>

            {/* Tabs */}
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile
                sx={{ mb: 2 }}
            >
                {TABS.map((tab, index) => (
                    <Tab key={tab.value} label={tab.label} />
                ))}
            </Tabs>

            {/* Error or Loading */}
            {loading && <CircularProgress sx={{ display: "block", m: "20px auto" }} />}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Render Trash Pickers */}
            {!loading && filteredTrashPickers.length === 0 && (
                <Typography textAlign="center" color="text.secondary" mt={4}>
                    No trash pickers found.
                </Typography>
            )}

            {!loading && filteredTrashPickers.length > 0 && (
                <>
                    {/* Mobile View: Card Layout */}
                    {isMobile ? (
                        <Box>
                            {filteredTrashPickers.map((picker) => (
                                <Card key={picker.pickerId} sx={{ mb: 2, backgroundColor: "#f9f9f9" }}>
                                    <CardHeader
                                        title={
                                            <Typography fontWeight={600}>
                                                {picker.firstName} {picker.lastName}
                                            </Typography>
                                        }
                                        subheader={
                                            <Chip
                                                label={picker.status}
                                                size="small"
                                                color={picker.status === "ACTIVE" ? "success" : "default"}
                                                sx={{ textTransform: "capitalize", fontWeight: 500 }}
                                            />
                                        }
                                        action={
                                            <Stack direction="row" spacing={1}>
                                                {picker.active ? (
                                                    <IconButton color="primary" onClick={() =>
                                                        setConfirmDialog({
                                                            open: true,
                                                            action: "deactivate",
                                                            item: picker
                                                        })
                                                    }>
                                                        <BlockIcon />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton color="primary" onClick={() =>
                                                        setConfirmDialog({
                                                            open: true,
                                                            action: "activate",
                                                            item: picker
                                                        })
                                                    }>
                                                        <RestoreIcon />
                                                    </IconButton>
                                                )}
                                                <IconButton color="error" onClick={() =>
                                                    setConfirmDialog({
                                                        open: true,
                                                        action: "delete",
                                                        item: picker
                                                    })
                                                }>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        }
                                    />

                                    <CardContent sx={{ pt: 0 }}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <EmailIcon color="action" fontSize="small" />
                                                <Typography variant="body2">{picker.email}</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <PhoneIcon color="action" fontSize="small" />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                        color: "text.secondary",
                                                    }}
                                                    onClick={() => (window.location.href = `tel:${picker.mobileNumber}`)}
                                                >
                                                    {picker.mobileNumber}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>

                                    <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                                        {/* Optional extra actions */}
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        // Desktop View: DataGrid Layout
                        <Box sx={{ width: "100%" }}>
                            <DataGrid
                                rows={filteredTrashPickers}
                                getRowId={(row) => row.pickerId}
                                columns={columns}
                                loading={loading}
                                pageSizeOptions={[10, 25, 50]}
                                disableSelectionOnClick
                                disableRowSelectionOnClick
                            />
                        </Box>
                    )}
                </>
            )}

            <AddTrashPickerDialog open={open} handleClose={() => setOpen(false)} />

            <ConfirmationDialog
                open={confirmDialog.open}
                title={
                    confirmDialog.action === "delete"
                        ? "Permanently Delete?"
                        : confirmDialog.action === "deactivate"
                            ? "Deactivate Item?"
                            : "Activate Item?"
                }
                description={`Are you sure you want to ${confirmDialog.action === "delete"
                    ? "permanently delete"
                    : confirmDialog.action === "deactivate"
                        ? "deactivate"
                        : "activate"
                    } "${confirmDialog.item?.displayName}"?`}
                confirmText={
                    confirmDialog.action === "delete"
                        ? "Delete"
                        : confirmDialog.action === "deactivate"
                            ? "Deactivate"
                            : "Activate"
                }
                onConfirm={() => {
                    const { action, item } = confirmDialog;
                    if (action === "delete") handlePermanentDelete(item.pickerId);
                    if (action === "deactivate") handleSoftDelete(item.pickerId);
                    if (action === "activate") handleActivate(item.pickerId);
                    setConfirmDialog({ open: false, action: null, item: null });
                }}
                onClose={() => setConfirmDialog({ open: false, action: null, item: null })}
            />

        </Box>
    );
};

export default AdminTrashPicker;
