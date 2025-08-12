import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, useMediaQuery, useTheme, Stack, Alert,
  CircularProgress, Card, CardContent, IconButton, Tooltip, Chip, Tabs, Tab
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreIcon from "@mui/icons-material/Restore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTrashMaterialsThunk,
  createTrashMaterialThunk,
  updateTrashMaterialThunk,
  softDeleteTrashMaterialThunk,
  permanentDeleteTrashMaterialThunk,
  clearMessage,
  fetchActiveTrashMaterialsThunk
} from "../../store/slice/trashMaterialSlice";
import { ActionsColumn } from "../../components/ActionsColumn";
import { useSnackbar } from "../../components/SnackbarProvider";
import { activateSoftDeletedTrashMaterial } from "../../service/apiServices/scrapRatesService";
import ConfirmationDialog from "../../components/ConfirmationDialog";




const AdminPricing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const message = useSelector(state => state.trashMaterial.message);
  const { showMessage } = useSnackbar();

  const { list, status, error } = useSelector((state) => state.trashMaterial);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    type: "",
    displayName: "",
    pricePerUnit: "",
    unit: "",
    description: "",
    imageUrl: ""
  });
  const [editMode, setEditMode] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'warning' | 'info'
  });
  const [tab, setTab] = useState("ACTIVE");

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null, // 'delete' | 'deactivate' | 'activate'
    item: null
  });


  useEffect(() => {
    if (message) {
      alert(message);  // or use a Snackbar/toast
      showMessage(message || "Cleared", "success");
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (tab === "ALL" || tab === "INACTIVE") {
      dispatch(fetchTrashMaterialsThunk());
    } else {
      dispatch(fetchActiveTrashMaterialsThunk());
    }
  }, [dispatch, tab]);


  const filteredList = useMemo(() => {
    let baseList = list;

    if (tab === "INACTIVE") {
      baseList = baseList.filter(item => item.active === false);
    }

    if (!searchQuery.trim()) return baseList;

    const q = searchQuery.toLowerCase();
    return baseList.filter(item =>
      item.displayName?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      String(item.pricePerUnit)?.toLowerCase().includes(q) ||
      item.unit?.toLowerCase().includes(q)
    );
  }, [list, searchQuery, tab]);



  const handleOpen = () => {
    setFormData({
      id: null, type: "", displayName: "", pricePerUnit: "", unit: "",
      description: "", imageUrl: ""
    });
    setEditMode(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    const { id, ...rest } = formData;
    const payload = { ...rest, pricePerUnit: parseFloat(formData.pricePerUnit) || 0 };

    try {
      if (editMode) {
        const res = await dispatch(updateTrashMaterialThunk({ id, payload })).unwrap();
        showMessage(res.message || "Updated successfully", "success");
      } else {
        const res = await dispatch(createTrashMaterialThunk(payload)).unwrap();
        showMessage(res.message || "Created successfully", "success");
      }
      setOpen(false);
    } catch (error) {
      showMessage(error.message || "Operation failed", "error");
    }
  };



  const handleEditClick = (row) => {
    console.log('edit data : ', row)

    setFormData(row);
    setEditMode(true);
    setOpen(true);
  };

  const handleSoftDelete = async (id) => {
    try {
      await dispatch(softDeleteTrashMaterialThunk(id)).unwrap();
      showMessage("Item deleted successfully", "success");
    } catch (error) {
      showMessage(error.message || "Failed to delete item", "error");
    }
  };


  const handlePermanentDelete = async (id) => {
    try {
      await dispatch(permanentDeleteTrashMaterialThunk(id)).unwrap();
      showMessage("Item permanently deleted", "success");
    } catch (error) {
      showMessage(error.message || "Failed to permanently delete", "error");
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await dispatch(activateSoftDeletedTrashMaterial(id)).unwrap();
      showMessage(response?.message || "Activated successfully", "success");
    } catch (error) {
      showMessage(error?.message || "Failed to activate", "error");
    }
  };

  const handleTabChange = (event, newValue) => setTab(newValue);


  const handleRefresh = () => {
    if (tab === "ALL" || tab === "INACTIVE") {
      dispatch(fetchTrashMaterialsThunk());
    } else {
      dispatch(fetchActiveTrashMaterialsThunk());
    }
  };



  const columns = [
    { field: "id", headerName: "ID", flex: 0.3, align: "center", headerAlign: "center" },
    {
      field: "active",
      headerName: "Status",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const active = params.value;

        return (
          <Tooltip title={active ? "This material is currently active" : "This material is inactive"}>
            <Chip
              icon={active ? <CheckCircleRoundedIcon /> : <BlockRoundedIcon />}
              label={active ? "Active" : "Inactive"}
              color={active ? "success" : "error"}
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 500,
                borderColor: active ? 'success.main' : '#FFA726',
                color: active ? 'success.main' : '#FFA726',
                '& .MuiChip-icon': {
                  color: active ? 'success.main' : '#FFA726',
                }
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      field: "type", headerName: "Type", flex: 0.8, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <Chip label={params.value?.replace(/_/g, " ")} color="primary" variant="outlined" size="small" />
      )
    },
    { field: "displayName", headerName: "Title", flex: 1, align: "center", headerAlign: "center" },
    {
      field: "pricePerUnit", headerName: "Price", flex: 0.5, align: "right", headerAlign: "right",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
            fontWeight: "bold",
            color: "primary.main"
          }}
        >
          ₹{params.value}
        </Box>
      )
    },
    {
      field: "unit", headerName: "Per Unit", flex: 0.5, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="secondary" variant="outlined" />
      )
    },
    // {
    //   field: "imageDesc", headerName: "Description", flex: 1.5, align: "center", headerAlign: "center",
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <Typography noWrap>{params.value}</Typography>
    //     </Tooltip>
    //   )
    // },
    {
      field: "imageUrl", headerName: "Image", flex: 0.5, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value}
          alt="img"
          sx={{
            width: 50,
            height: 50,
            borderRadius: 1,
            objectFit: "cover",
            display: "block",
            mx: "auto",  // horizontal center margin auto
          }}
        />
      )
    },
    {
      field: "recyclable", headerName: "Recyclable", flex: 0.5, align: "center", headerAlign: "center",
      renderCell: (params) => params.value ? <Chip label="Yes" color="success" /> : <Chip label="No" color="default" />
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
          handleEditClick={handleEditClick}
          handleSoftDelete={handleSoftDelete}
          handlePermanentDelete={handlePermanentDelete}
          handleActivate={handleActivate}
        />
      ),
    }

  ];

  if (status === "loading" && !list.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, md: 3 }} mb={{ xs: "50px", sm: 0 }}>

      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Pricing Management</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            size="small" placeholder="Search..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
          />
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={status === "loading"}>
            {status === "loading" ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Add Price</Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Active" value="ACTIVE" />
        <Tab label="Inactive" value="INACTIVE" />
        <Tab label="All" value="ALL" />
      </Tabs>

      {isMobile ? (
        <Stack spacing={2}>
          {filteredList.length ? filteredList.map(item => (
            <Card key={item.id} elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 1 }}>
                <Stack spacing={1}>

                  {/* Top Bar: Status + Type */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={item.active ? "Active" : "Inactive"}
                      color={item.active ? "success" : "default"}
                      size="small"
                      icon={item.active ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                      variant="outlined"
                    />
                    <Chip
                      label={item.type?.replace(/_/g, " ")}
                      color="primary"
                      size="small"
                      variant="filled"
                    />
                  </Stack>

                  {/* Image */}
                  {item.imageUrl && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <Box
                        component="img"
                        src={item.imageUrl}
                        alt={item.displayName}
                        sx={{
                          width: "50%",
                          maxWidth: "80%",
                          height: 120,
                          objectFit: "contain",
                          borderRadius: 2,
                          // boxShadow: 1,
                        }}
                      />
                    </Box>
                  )}


                  {/* Title */}
                  <Typography variant="h6" fontWeight="bold" textAlign="center">
                    {item.displayName}
                  </Typography>

                  {/* Price and Unit */}
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                      ₹{item.pricePerUnit}
                    </Typography>
                    <Chip label={item.unit} size="small" color="secondary" />
                  </Stack>

                  {/* Description */}
                  {item.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                      sx={{ fontStyle: 'italic' }}
                    >
                      {item.description}
                    </Typography>
                  )}

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon color="info" />}
                      onClick={() => handleEditClick(item)}
                      sx={{ flexGrow: 1, minWidth: 0 }}
                    >
                      Edit
                    </Button>

                    {item.active ? (
                      <Button
                        variant="outlined"
                        size="small"
                        color="warning"
                        startIcon={<BlockIcon color="warning" />}
                        onClick={() =>
                          setConfirmDialog({
                            open: true,
                            action: "deactivate",
                            item
                          })
                        }
                        sx={{ flexGrow: 1, minWidth: 0 }}
                      >
                        Deactive
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        startIcon={<RestoreIcon color="success" />}
                        onClick={() =>
                          setConfirmDialog({
                            open: true,
                            action: "activate",
                            item
                          })
                        }
                        sx={{ flexGrow: 1, minWidth: 0 }}
                      >
                        Active
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteForeverIcon color="error" />}
                      onClick={() =>
                        setConfirmDialog({
                          open: true,
                          action: "delete",
                          item
                        })
                      }
                      sx={{ flexGrow: 1, minWidth: 0 }}
                    >
                      Delete
                    </Button>
                  </Stack>


                </Stack>
              </CardContent>
            </Card>
          )) : (
            <Typography textAlign="center">No items found</Typography>
          )}
        </Stack>

      )
        : (
          <DataGrid
            rows={filteredList} columns={columns} loading={status === "loading"}
            pageSizeOptions={[10, 25, 50]} disableRowSelectionOnClick
            autoHeight
          />
        )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit Price" : "Add Price"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField name="displayName" label="Title" value={formData.displayName} onChange={handleInputChange} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField name="pricePerUnit" label="Price" value={formData.pricePerUnit} onChange={handleInputChange} type="number" fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField name="unit" label="Per Unit" value={formData.unit} onChange={handleInputChange} select fullWidth required >
                {["KG",
                  "LITER",
                  "PC",
                  "TON",
                  "GRAM"].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField name="type" label="Type" value={formData.type} onChange={handleInputChange} select fullWidth required>
                {["METAL",
                  "GLASS",
                  "PAPER",
                  "PLASTIC",
                  "ELECTRONIC_SCRAP",
                  "OTHER_E_WASTE",
                  "AC",
                  "VEHICLE"].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField name="description" label="Description" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="imageUrl" label="Image Link" value={formData.imageUrl} onChange={handleInputChange} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit} disabled={status === "loading"}>
            {editMode ? "Save Changes" : "Add Price"}
          </Button>
        </DialogActions>
      </Dialog>

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
          if (action === "delete") handlePermanentDelete(item.id);
          if (action === "deactivate") handleSoftDelete(item.id);
          if (action === "activate") handleActivate(item.id);
          setConfirmDialog({ open: false, action: null, item: null });
        }}
        onClose={() => setConfirmDialog({ open: false, action: null, item: null })}
      />

    </Box>
  );
};

export default AdminPricing;
