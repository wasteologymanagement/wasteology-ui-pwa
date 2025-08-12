import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, useMediaQuery, useTheme, Stack, Alert,
  CircularProgress, Card, CardContent, IconButton, Tooltip, Chip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Refresh as RefreshIcon, Search as SearchIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTrashMaterialsThunk,
  createTrashMaterialThunk,
  updateTrashMaterialThunk
} from "../../store/slice/trashMaterialSlice";

const AdminPricing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const { list, status, error } = useSelector((state) => state.trashMaterial);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    type: "",
    title: "",
    price: "",
    perUnit: "",
    imageDesc: "",
    imageLink: ""
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchTrashMaterialsThunk());
  }, [dispatch]);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(item =>
      item.title?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q) ||
      item.imageDesc?.toLowerCase().includes(q) ||
      String(item.price)?.toLowerCase().includes(q) ||
      item.perUnit?.toLowerCase().includes(q)
    );
  }, [list, searchQuery]);

  const handleOpen = () => {
    setFormData({
      id: null, type: "", title: "", price: "", perUnit: "",
      imageDesc: "", imageLink: ""
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
    const payload = { ...formData, price: parseFloat(formData.price) || 0 };

    if (editMode) {
      await dispatch(updateTrashMaterialThunk(payload));
    } else {
      await dispatch(createTrashMaterialThunk(payload));
    }
    setOpen(false);
  };

  const handleEditClick = (row) => {
    setFormData(row);
    setEditMode(true);
    setOpen(true);
  };

  const handleRefresh = () => {
    dispatch(fetchTrashMaterialsThunk());
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3, align: "center", headerAlign: "center" },
    {
      field: "type", headerName: "Type", flex: 0.8, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <Chip label={params.value?.replace(/_/g, " ")} color="primary" variant="outlined" size="small" />
      )
    },
    { field: "title", headerName: "Title", flex: 1, align: "center", headerAlign: "center" },
    {
      field: "price", headerName: "Price", flex: 0.5, align: "right", headerAlign: "right",
      renderCell: (params) => (
        <Typography fontWeight="bold" color="primary">₹{params.value}</Typography>
      )
    },
    {
      field: "perUnit", headerName: "Per Unit", flex: 0.5, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="secondary" variant="outlined" />
      )
    },
    {
      field: "imageDesc", headerName: "Description", flex: 1.5, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography noWrap>{params.value}</Typography>
        </Tooltip>
      )
    },
    {
      field: "imageLink", headerName: "Image", flex: 0.5, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <Box component="img" src={params.value} alt="img"
          sx={{ width: 50, height: 50, borderRadius: 1, objectFit: "cover" }} />
      )
    },
    {
      field: "actions", headerName: "Actions", flex: 0.5, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleEditClick(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
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

      {isMobile ? (
        <Stack spacing={2}>
          {filteredList.length ? filteredList.map(item => (
            <Card key={item.id}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6">{item.title}</Typography>
                  <Chip label={item.type?.replace(/_/g, " ")} color="primary" size="small" />
                  <Typography fontWeight="bold" color="primary">₹{item.price}</Typography>
                  <Chip label={item.perUnit} size="small" color="secondary" />
                  <Typography variant="body2" noWrap>{item.imageDesc}</Typography>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(item)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />}>Delete</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )) : <Typography textAlign="center">No items found</Typography>}
        </Stack>
      ) : (
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
              <TextField name="title" label="Title" value={formData.title} onChange={handleInputChange} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField name="price" label="Price" value={formData.price} onChange={handleInputChange} type="number" fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField name="perUnit" label="Per Unit" value={formData.perUnit} onChange={handleInputChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="type" label="Type" value={formData.type} onChange={handleInputChange} select fullWidth required>
                {["PLASTIC", "METAL", "GLASS"].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField name="imageDesc" label="Description" value={formData.imageDesc} onChange={handleInputChange} fullWidth multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="imageLink" label="Image Link" value={formData.imageLink} onChange={handleInputChange} fullWidth />
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
    </Box>
  );
};

export default AdminPricing;
