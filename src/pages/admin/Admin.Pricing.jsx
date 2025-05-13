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
  Grid,
  useMediaQuery,
  useTheme,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesThunk,
  editPriceThunk,
  uploadPriceThunk,
} from "../../store/slice/ratesSlice";

const AdminPricing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const { categories, types, status, error } = useSelector(
    (state) => state.price
  );

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    imageDesc: "",
    type: "",
    perUnit: "",
    imageLink: "",
    contentType: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  // Filter categories when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories || []);
    } else {
      const filtered = (categories || []).filter((category) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          category.title?.toLowerCase().includes(searchLower) ||
          category.type?.toLowerCase().includes(searchLower) ||
          category.imageDesc?.toLowerCase().includes(searchLower) ||
          category.perUnit?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: "",
      price: "",
      imageDesc: "",
      type: "",
      perUnit: "",
      imageLink: "",
      contentType: "",
    });
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editMode) {
        const editPayload = {
          price: payload.price,
          fileDesc: payload.imageDesc,
          id: payload.id,
        };
        await dispatch(editPriceThunk(editPayload));
      } else {
        await dispatch(uploadPriceThunk(payload));
      }

      handleClose();
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const handleEditClick = (row) => {
    setFormData(row);
    setEditMode(true);
    setOpen(true);
  };

  const handleRefresh = () => {
    dispatch(fetchCategoriesThunk());
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value.replace(/_/g, " ")}
          color="primary"
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          ₹{params.value}
        </Typography>
      ),
    },
    {
      field: "perUnit",
      headerName: "Per Unit",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="secondary"
          variant="outlined"
        />
      ),
    },
    {
      field: "imageDesc",
      headerName: "Description",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "imageLink",
      headerName: "Image",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value}
          alt="Pricing Item"
          sx={{
            width: 50,
            height: 50,
            borderRadius: 1,
            objectFit: "cover",
            boxShadow: 1,
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  if (status === "loading" && !categories) {
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
          Pricing Management
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <TextField
            size="small"
            placeholder="Search prices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
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
            disabled={status === "loading"}
            sx={{ minWidth: { xs: "100%", sm: 120 } }}
          >
            {status === "loading" ? "Refreshing..." : "Refresh"}
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
            Add Price
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
          {filteredCategories.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              py={4}
            >
              No pricing items found
            </Typography>
          ) : (
            filteredCategories.map((category) => (
              <Card key={category.id} elevation={2}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {category.title}
                      </Typography>
                      <Chip
                        label={category.type.replace(/_/g, " ")}
                        color="primary"
                        size="small"
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="text.secondary">
                        Price
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="primary"
                      >
                        ₹{category.price}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="text.secondary">
                        Per Unit
                      </Typography>
                      <Chip
                        label={category.perUnit}
                        size="small"
                        color="secondary"
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {category.imageDesc}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditClick(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </Stack>
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
            rows={filteredCategories}
            columns={columns}
            loading={status === "loading"}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: "type", sort: "asc" }] },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "action.hover",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.paper",
                borderBottom: 2,
                borderColor: "divider",
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
                    No pricing items found
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
            {editMode ? (
              <EditIcon color="primary" />
            ) : (
              <AddIcon color="primary" />
            )}
            <Typography variant="h6">
              {editMode ? "Edit Price" : "Add New Price"}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={editMode}
                error={!formData.title && editMode}
                helperText={
                  !formData.title && editMode ? "Title is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                required
                type="number"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                error={!formData.price && editMode}
                helperText={
                  !formData.price && editMode ? "Price is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Per Unit"
                name="perUnit"
                value={formData.perUnit}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={editMode}
                error={!formData.perUnit && editMode}
                helperText={
                  !formData.perUnit && editMode ? "Unit is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                select
                fullWidth
                required
                disabled={editMode}
                error={!formData.type && editMode}
                helperText={
                  !formData.type && editMode ? "Type is required" : ""
                }
              >
                {types?.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="imageDesc"
                value={formData.imageDesc}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                error={!formData.imageDesc && editMode}
                helperText={
                  !formData.imageDesc && editMode
                    ? "Description is required"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image Link"
                name="imageLink"
                value={formData.imageLink}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={editMode}
                error={!formData.imageLink && editMode}
                helperText={
                  !formData.imageLink && editMode
                    ? "Image link is required"
                    : ""
                }
              />
            </Grid>
            {formData.imageLink && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={formData.imageLink}
                    alt="Preview"
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      objectFit: "cover",
                      boxShadow: 1,
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            disabled={status === "loading"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={status === "loading"}
            startIcon={
              status === "loading" ? <CircularProgress size={20} /> : null
            }
          >
            {status === "loading"
              ? editMode
                ? "Saving..."
                : "Adding..."
              : editMode
              ? "Save Changes"
              : "Add Price"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPricing;
