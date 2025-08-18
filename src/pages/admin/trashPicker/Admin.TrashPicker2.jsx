import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  DirectionsCar as VehicleIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAllTrashPickersDetails } from "../../../service/apiServices/trashCollectionService";

const AdminTrashPicker = () => {
  // UI & Data Management Hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    assignedZone: "",
    areaCovered: [],
    vehicles: [],
    status: "ACTIVE",
  });

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  // Handle search filter
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return setFilteredRows(rows);
    setFilteredRows(
      rows.filter((row) =>
        [row.firstName, row.lastName, row.contactNumber, row.address]
          .some((val) => val?.toLowerCase().includes(q)) ||
        row.areaCovered.some((a) => a.toLowerCase().includes(q)) ||
        row.vehicleAvailable.some((v) => v.toLowerCase().includes(q))
      )
    );
  }, [rows, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllTrashPickersDetails();
      setRows(data);
      setFilteredRows(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trash pickers data");
    } finally {
      setLoading(false);
    }
  };

  // Handler utilities
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      addressLine1: "",
      addressLine2: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      assignedZone: "",
      areaCovered: [],
      vehicles: [],
      status: "ACTIVE",
    });
  };
  const handleRowClick = (params) =>
    navigate(`/app/admin/trash-pickers/${params.row.trashPickerId}`);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleKeyDown = (e, field) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], e.target.value.trim()],
      }));
      e.target.value = "";
    }
  };
  const handleRemoveChip = (field, idx) =>
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));

  const handleAddVehicle = () => {
    setFormData((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, { vehicleNumber: "", type: "", capacity: "", available: true }],
    }));
  };
  const handleVehicleChange = (idx, field, value) => {
    const updated = [...formData.vehicles];
    updated[idx][field] = value;
    setFormData((prev) => ({ ...prev, vehicles: updated }));
  };

  // Submit handler (mock)
  const handleFormSubmit = () => {
    const newId = rows.length + 1;
    setRows((prev) => [...prev, { trashPickerId: newId, ...formData }]);
    handleClose();
  };
  const handleRefresh = () => fetchData();

  // Table columns
  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
          <PersonIcon color="primary" fontSize="small" />
          <Typography sx={{ fontWeight: 500 }}>{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500, py: 1 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "contactNumber",
      headerName: "Phone",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
          <PhoneIcon color="primary" fontSize="small" />
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${params.value}`;
            }}
          >
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "address",
      headerName: "Address",
      flex: 2,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ py: 1, px: 1 }}>
          <LocationIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "areaCovered",
      headerName: "Area Covered",
      flex: 1.5,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, py: 1, px: 1, justifyContent: "center" }}>
          {Array.isArray(params.value) && params.value.length > 0 ? (
            params.value.map((area, idx) => (
              <Chip key={idx} label={area} size="small" color="primary" variant="outlined" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              No areas assigned
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "vehicleAvailable",
      headerName: "Vehicle Available",
      flex: 1.5,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, py: 1, px: 1, justifyContent: "center" }}>
          {Array.isArray(params.value) && params.value.length > 0 ? (
            params.value.map((v, idx) => (
              <Stack key={idx} direction="row" spacing={0.5} alignItems="center">
                <VehicleIcon color="primary" fontSize="small" />
                <Typography variant="body2">{v}</Typography>
              </Stack>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No vehicle available
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Chip
            label={params.value}
            color={params.value === "ACTIVE" ? "success" : "default"}
            variant="filled"
            size="small"
            sx={{ textTransform: "capitalize", fontWeight: 500 }}
          />
        </Box>
      ),
    },
  ];

  if (loading && !rows.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, mb: { xs: "50px", sm: 0 } }}>
      {/* Header */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }} spacing={2} mb={3}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Trash Pickers Management
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
          <TextField
            size="small"
            placeholder="Search trash pickers..."
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
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading} sx={{ minWidth: { xs: "100%", sm: 120 } }}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ minWidth: { xs: "100%", sm: 150 }, borderRadius: 2 }}>
            Add Picker
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isMobile ? (
        <Stack spacing={2}>
          {filteredRows.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              No trash pickers found
            </Typography>
          ) : (
            filteredRows.map((picker) => (
              <Card key={picker.trashPickerId} elevation={2} onClick={() => handleRowClick({ row: picker })} sx={{ cursor: "pointer" }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight="bold">
                        {picker.firstName} {picker.lastName}
                      </Typography>
                      <Chip label={picker.status} color={picker.status === "ACTIVE" ? "success" : "default"} size="small" />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon color="action" fontSize="small" />
                      <Typography variant="body2">{picker.contactNumber}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <LocationIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                      <Typography variant="body2">{picker.address}</Typography>
                    </Stack>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Areas Covered
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {picker.areaCovered?.map((area, idx) => (
                          <Chip key={idx} label={area} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Vehicles Available
                      </Typography>
                      <Stack spacing={0.5}>
                        {picker.vehicleAvailable?.length ? (
                          picker.vehicleAvailable.map((v, idx) => (
                            <Stack key={idx} direction="row" spacing={0.5} alignItems="center">
                              <VehicleIcon color="action" fontSize="small" />
                              <Typography variant="body2">{v}</Typography>
                            </Stack>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">No vehicle available</Typography>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      ) : (
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            getRowId={(row) => row.trashPickerId}
            columns={columns}
            loading={loading}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } }, sorting: { sortModel: [{ field: "firstName", sort: "asc" }] } }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            components={{ NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                <Typography variant="body1" color="text.secondary">No trash pickers found</Typography>
              </Stack>
            )}}
            sx={{
              "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover", cursor: "pointer" },
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "background.paper", borderBottom: 2, borderColor: "divider", "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 } },
            }}
          />
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <AddIcon color="primary" />
            <Typography variant="h6">Add New Trash Picker</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {/* Form Fields Grid */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* First / Last Name */}
            {["firstName", "lastName", "email", "phone", "password", "addressLine1", "addressLine2", "street", "city", "state", "zip", "country", "assignedZone"].map((field, idx) => (
              <Grid key={idx} item xs={12} sm={field === "street" || field === "city" ? 6 : 12}>
                <TextField
                  label={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  name={field}
                  type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                  value={formData[field]}
                  onChange={handleInputChange}
                  fullWidth
                  required={["firstName", "lastName", "email", "phone", "password"].includes(field)}
                />
              </Grid>
            ))}

            {/* Area Covered */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Area Covered</Typography>
              <TextField placeholder="Type area & press Enter" fullWidth onKeyDown={(e) => handleKeyDown(e, "areaCovered")} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {formData.areaCovered.map((area, idx) => (
                  <Chip key={idx} label={area} onDelete={() => handleRemoveChip("areaCovered", idx)} color="primary" variant="outlined" />
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
                          label={f === "vehicleNumber" ? "Vehicle Number" : f[0].toUpperCase() + f.slice(1)}
                          type={f === "capacity" ? "number" : "text"}
                          value={v[f]}
                          onChange={(e) => handleVehicleChange(idx, f, e.target.value)}
                          fullWidth
                        />
                      </Grid>
                   ))}
                  </Grid>
                ))}
                <Button size="small" onClick={handleAddVehicle}>+ Add Vehicle</Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : null}>
            {loading ? "Adding..." : "Add Picker"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTrashPicker;
