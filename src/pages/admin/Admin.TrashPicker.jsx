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
  MenuItem,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Tooltip,
  Grid,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  LocationOn as LocationIcon,
  DirectionsCar as VehicleIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAllTrashPickersDetails } from "../../service/apiServices/trashCollectionService";

const AdminTrashPicker = () => {
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
    phone: "",
    address: "",
    areaCovered: [],
    vehicleAvailable: [],
    status: "ACTIVE",
  });

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
          row.firstName?.toLowerCase().includes(searchLower) ||
          row.lastName?.toLowerCase().includes(searchLower) ||
          row.contactNumber?.includes(searchLower) ||
          row.address?.toLowerCase().includes(searchLower) ||
          row.areaCovered?.some((area) =>
            area.toLowerCase().includes(searchLower)
          ) ||
          row.vehicleAvailable?.some((vehicle) =>
            vehicle.toLowerCase().includes(searchLower)
          )
        );
      });
      setFilteredRows(filtered);
    }
  }, [searchQuery, rows]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllTrashPickersDetails();
      setRows(response);
      setFilteredRows(response);
      setError(null);
    } catch (err) {
      setError("Failed to fetch trash pickers data");
      console.error("Error fetching trash pickers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      areaCovered: [],
      vehicleAvailable: [],
      status: "ACTIVE",
    });
  };

  const handleRowClick = (params) => {
    navigate(`/app/admin/trash-pickers/${params.row.trashPickerId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      setFormData((prevData) => ({
        ...prevData,
        [field]: [...prevData[field], e.target.value.trim()],
      }));
      e.target.value = "";
    }
  };

  const handleRemoveChip = (field, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async () => {
    try {
      // TODO: Implement API call to create new trash picker
      const newId = rows.length + 1;
      const newRow = { trashPickerId: newId, ...formData };
      setRows((prevRows) => [...prevRows, newRow]);
      handleClose();
    } catch (error) {
      console.error("Failed to create trash picker:", error);
      setError("Failed to create trash picker");
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            width: "100%",
            justifyContent: "center",
            py: 1,
          }}
        >
          <PersonIcon color="primary" fontSize="small" />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            {params.value}
          </Typography>
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
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "text.primary",
            py: 1,
          }}
        >
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
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            width: "100%",
            justifyContent: "center",
            py: 1,
          }}
        >
          <PhoneIcon color="primary" fontSize="small" />
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                textDecoration: "underline",
                cursor: "pointer",
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
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{
            width: "100%",
            py: 1,
            px: 1,
          }}
        >
          <LocationIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              whiteSpace: "normal",
              wordWrap: "break-word",
              lineHeight: 1.4,
            }}
          >
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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            py: 1,
            px: 1,
            justifyContent: "center",
            minHeight: 40,
            alignItems: "center",
          }}
        >
          {Array.isArray(params.value) && params.value.length > 0 ? (
            params.value.map((area, index) => (
              <Chip
                key={index}
                label={area}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
              />
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            py: 1,
            px: 1,
            minHeight: 40,
            justifyContent: "center",
          }}
        >
          {Array.isArray(params.value) && params.value.length > 0 ? (
            params.value.map((vehicle, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                <VehicleIcon color="primary" fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {vehicle}
                </Typography>
              </Stack>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
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
            sx={{
              textTransform: "capitalize",
              fontWeight: 500,
              minWidth: 90,
              "&:hover": {
                opacity: 0.9,
              },
            }}
          />
        </Box>
      ),
    },
  ];

  if (loading && !rows.length) {
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
    <Box sx={{ p: { xs: 2, md: 3 }, mb: { xs: "50px", sm: 0 } }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        mb={3}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Trash Pickers Management
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
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
          {/* <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ minWidth: { xs: '100%', sm: 120 } }}
          >
            Filter
          </Button> */}
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
            onClick={handleOpen}
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              borderRadius: 2,
            }}
          >
            Add Picker
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Content Section */}
      {isMobile ? (
        // Mobile View - Cards
        <Stack spacing={2}>
          {filteredRows.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              py={4}
            >
              No trash pickers found
            </Typography>
          ) : (
            filteredRows.map((picker) => (
              <Card
                key={picker.trashPickerId}
                elevation={2}
                onClick={() => handleRowClick({ row: picker })}
                sx={{ cursor: "pointer" }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {picker.firstName} {picker.lastName}
                      </Typography>
                      <Chip
                        label={picker.status}
                        color={
                          picker.status === "ACTIVE" ? "success" : "default"
                        }
                        size="small"
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {picker.contactNumber}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <LocationIcon
                        color="action"
                        fontSize="small"
                        sx={{ mt: 0.5 }}
                      />
                      <Typography variant="body2">{picker.address}</Typography>
                    </Stack>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Areas Covered
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {Array.isArray(picker.areaCovered) &&
                          picker.areaCovered.map((area, index) => (
                            <Chip
                              key={index}
                              label={area}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Vehicles Available
                      </Typography>
                      <Stack spacing={0.5}>
                        {Array.isArray(picker.vehicleAvailable) &&
                        picker.vehicleAvailable.length > 0 ? (
                          picker.vehicleAvailable.map((vehicle, index) => (
                            <Stack
                              key={index}
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <VehicleIcon color="action" fontSize="small" />
                              <Typography variant="body2">{vehicle}</Typography>
                            </Stack>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No vehicle available
                          </Typography>
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
        // Desktop View - DataGrid
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            getRowId={(row) => row.trashPickerId}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: "firstName", sort: "asc" }] },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            sx={{
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "action.hover",
                cursor: "pointer",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.paper",
                borderBottom: 2,
                borderColor: "divider",
                "& .MuiDataGrid-columnHeader": {
                  py: 1.5,
                  "&:focus": { outline: "none" },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                    color: "text.primary",
                  },
                },
              },
              "& .MuiDataGrid-cell": {
                borderColor: "divider",
                "&:focus": { outline: "none" },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: 2,
                borderColor: "divider",
              },
              "& .MuiDataGrid-selectedRowCount": {
                visibility: "hidden",
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
                    No trash pickers found
                  </Typography>
                </Stack>
              ),
            }}
          />
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
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
            <AddIcon color="primary" />
            <Typography variant="h6">Add New Trash Picker</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                required
                error={!formData.firstName}
                helperText={!formData.firstName ? "First name is required" : ""}
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
                error={!formData.lastName}
                helperText={!formData.lastName ? "Last name is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
                type="tel"
                error={!formData.phone}
                helperText={!formData.phone ? "Phone number is required" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                minRows={2}
                error={!formData.address}
                helperText={!formData.address ? "Address is required" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Area Covered
              </Typography>
              <TextField
                placeholder="Type an area and press Enter"
                fullWidth
                onKeyDown={(e) => handleKeyDown(e, "areaCovered")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {formData.areaCovered.map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    onDelete={() => handleRemoveChip("areaCovered", index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Vehicle Available
              </Typography>
              <TextField
                placeholder="Type a vehicle and press Enter"
                fullWidth
                onKeyDown={(e) => handleKeyDown(e, "vehicleAvailable")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VehicleIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {formData.vehicleAvailable.map((vehicle, index) => (
                  <Chip
                    key={index}
                    label={vehicle}
                    onDelete={() => handleRemoveChip("vehicleAvailable", index)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                select
                fullWidth
                required
                error={!formData.status}
                helperText={!formData.status ? "Status is required" : ""}
              >
                {["ACTIVE", "INACTIVE"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
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
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Adding..." : "Add Picker"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTrashPicker;
