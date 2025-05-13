import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Badge,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FilterList,
  LocationOn,
  Phone,
  AccessTime,
  CalendarToday,
  Person,
  Assignment,
  Refresh,
  CheckCircle,
  Warning,
  Schedule,
} from "@mui/icons-material";
import {
  getAllTrashRequestDetails,
  getAllTrashPickersDetails,
  assignTrashRequestWithTrashPicker,
} from "../../service/apiServices/trashCollectionService";

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "assigned":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Schedule fontSize="small" />;
      case "assigned":
        return <Assignment fontSize="small" />;
      case "completed":
        return <CheckCircle fontSize="small" />;
      case "cancelled":
        return <Warning fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Chip
      icon={getStatusIcon(status)}
      label={status || "Unknown"}
      color={getStatusColor(status)}
      size="small"
      sx={{
        fontWeight: "medium",
        "& .MuiChip-icon": {
          color: "inherit",
        },
      }}
    />
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <Warning fontSize="small" />;
      case "medium":
        return <Schedule fontSize="small" />;
      case "low":
        return <CheckCircle fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Chip
      icon={getPriorityIcon(priority)}
      label={priority || "Medium"}
      color={getPriorityColor(priority)}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: "medium",
        "& .MuiChip-icon": {
          color: "inherit",
        },
      }}
    />
  );
};

// Mobile Card Component
const RequestCard = ({ request, onAssignPicker }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/app/admin/trash-list/details/${request.trashRequestId}`, {
      state: { rowData: request },
    });
  };

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        transition: "transform 0.2s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {request.userName}
          </Typography>
          <StatusChip status={request.status} />
        </Stack>

        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Phone color="action" fontSize="small" />
            <Typography variant="body2">
              {request.userRegisterNumber}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <LocationOn color="action" fontSize="small" sx={{ mt: 0.3 }} />
            <Typography variant="body2" sx={{ flex: 1 }}>
              {request.userAddress}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarToday color="action" fontSize="small" />
              <Typography variant="body2">
                {format(new Date(request.pickupDate), "dd MMM yyyy")}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTime color="action" fontSize="small" />
              <Typography variant="body2">{request.pickupTime}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Waste Type:
            </Typography>
            <Chip label={request.wasteType || "Mixed"} size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Quantity:
            </Typography>
            <Chip label={request.quantity || "N/A"} size="small" />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <PriorityBadge priority={request.priority || "Medium"} />
            <Button
              variant="contained"
              size="small"
              startIcon={<Assignment />}
              onClick={(e) => {
                e.stopPropagation();
                onAssignPicker(request);
              }}
            >
              Assign Picker
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const AdminTrashRequest = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [pickers, setPickers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPicker, setSelectedPicker] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Filter rows when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          row.userName?.toLowerCase().includes(searchLower) ||
          row.userRegisterNumber?.includes(searchQuery) ||
          row.userAddress?.toLowerCase().includes(searchLower) ||
          row.status?.toLowerCase().includes(searchLower) ||
          row.wasteType?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredRows(filtered);
    }
  }, [searchQuery, rows]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both trash requests and pickers in parallel
      const [requestsResponse, pickersResponse] = await Promise.all([
        getAllTrashRequestDetails(),
        getAllTrashPickersDetails(),
      ]);

      // Transform the data if needed
      const transformedRequests = requestsResponse.map((request) => ({
        ...request,
        pickupDate: request.pickupDate
          ? new Date(request.pickupDate).toISOString()
          : null,
        status: request.status || "pending",
        priority: request.priority || "medium",
      }));

      setRows(transformedRequests);
      setFilteredRows(transformedRequests);
      setPickers(pickersResponse);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err.response?.data?.message || "Failed to fetch data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setSelectedPicker("");
    setOpen(false);
  };

  const handleAssignPicker = async () => {
    if (!selectedRequest || !selectedPicker) return;

    try {
      setLoading(true);
      setError(null);

      await assignTrashRequestWithTrashPicker({
        trashRequestId: selectedRequest.trashRequestId,
        trashPickerId: selectedPicker,
      });

      // Refresh the data after successful assignment
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to assign picker:", error);
      setError(
        error.response?.data?.message ||
          "Failed to assign picker. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchData();
  };

  const columns = [
    {
      field: "userName",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "userRegisterNumber",
      headerName: "Phone",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Phone fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: "userAddress",
      headerName: "Address",
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <LocationOn fontSize="small" color="action" sx={{ mt: 0.3 }} />
          <Typography
            variant="body2"
            sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
          >
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "pickupDate",
      headerName: "Pickup Date",
      flex: 1,
      valueGetter: (params) =>
        format(new Date(params.row.pickupDate), "dd MMM yyyy"),
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "pickupTime",
      headerName: "Time",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <AccessTime fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<Assignment />}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDialog(params.row);
          }}
        >
          Assign
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          {/* <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ minWidth: { xs: '100%', sm: 120 } }}
          >
            Filter
          </Button> */}
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Content Section */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        // Mobile View - Cards
        <Box>
          {filteredRows.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              py={4}
            >
              No trash requests found
            </Typography>
          ) : (
            filteredRows.map((request) => (
              <RequestCard
                key={request.trashRequestId}
                request={request}
                onAssignPicker={handleOpenDialog}
              />
            ))
          )}
        </Box>
      ) : (
        // Desktop View - DataGrid
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.trashRequestId}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: "pickupDate", sort: "desc" }] },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            onRowClick={(params) => {
              navigate(
                `/app/admin/trash-list/details/${params.row.trashRequestId}`,
                {
                  state: { rowData: params.row },
                }
              );
            }}
            loading={loading}
            sx={{
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "action.hover",
                cursor: "pointer",
              },
            }}
            components={{
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="body1" color="text.secondary">
                    No trash requests found
                  </Typography>
                </Stack>
              ),
            }}
          />
        </Box>
      )}

      {/* Assign Picker Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <Assignment color="primary" />
            <Typography variant="h6">Assign Picker</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Request Details
                  </Typography>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Request ID:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedRequest.trashRequestId}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Name:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedRequest.userName}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Address:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        align="right"
                      >
                        {selectedRequest.userAddress}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Pickup:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {format(
                          new Date(selectedRequest.pickupDate),
                          "dd MMM yyyy"
                        )}{" "}
                        at {selectedRequest.pickupTime}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Status:
                      </Typography>
                      <StatusChip status={selectedRequest.status} />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <FormControl fullWidth>
                <InputLabel>Select Picker</InputLabel>
                <Select
                  value={selectedPicker}
                  onChange={(e) => setSelectedPicker(e.target.value)}
                  label="Select Picker"
                  disabled={loading}
                >
                  {pickers.map((picker) => (
                    <MenuItem
                      key={picker.trashPickerId}
                      value={picker.trashPickerId}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: "primary.main",
                          }}
                        >
                          {picker.userName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {picker.userName}
                        </Typography>
                        <Chip
                          label={picker.status}
                          size="small"
                          color={
                            picker.status === "Available"
                              ? "success"
                              : "warning"
                          }
                          sx={{ ml: "auto" }}
                        />
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignPicker}
            variant="contained"
            disabled={!selectedPicker || loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <Assignment />
            }
          >
            {loading ? "Assigning..." : "Assign Picker"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTrashRequest;
