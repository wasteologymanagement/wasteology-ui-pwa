import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Alert,
  Tooltip,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingActionsIcon,
  Category as CategoryIcon,
  Scale as ScaleIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getTrashDetailsForPickers, assignTrashRequestWithTrashPicker, getAllTrashPickersDetails } from '../../service/apiServices/trashCollectionService';

const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ASSIGNED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <PendingActionsIcon fontSize="small" />;
      case 'ASSIGNED':
        return <AssignmentIcon fontSize="small" />;
      case 'COMPLETED':
        return <CheckCircleIcon fontSize="small" />;
      case 'CANCELLED':
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Chip
      icon={getStatusIcon(status)}
      label={status}
      color={getStatusColor(status)}
      variant="filled"
      sx={{
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: 'inherit',
        },
      }}
    />
  );
};

const AdminTrashRequestDetails = () => {
  const { trashRequestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const clientData = location.state?.rowData;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trashDetails, setTrashDetails] = useState([]);
  const [pickers, setPickers] = useState([]);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedPicker, setSelectedPicker] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [detailsResponse, pickersResponse] = await Promise.all([
        getTrashDetailsForPickers(trashRequestId),
        getAllTrashPickersDetails()
      ]);
      setTrashDetails(detailsResponse);
      setPickers(pickersResponse);
      setError(null);
    } catch (err) {
      setError('Failed to load request details');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trashRequestId]);

  const handleAssignPicker = async () => {
    try {
      setAssignLoading(true);
      await assignTrashRequestWithTrashPicker(trashRequestId, selectedPicker);
      await fetchData();
      setOpenAssignDialog(false);
      setSelectedPicker('');
    } catch (err) {
      setError('Failed to assign picker');
      console.error('Error assigning picker:', err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshLoading(true);
      await fetchData();
    } finally {
      setRefreshLoading(false);
    }
  };

  if (loading && !trashDetails.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={handleBackClick} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Request Details
          </Typography>
          <StatusChip status={clientData?.status} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshLoading}
          >
            {refreshLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          {clientData?.status === 'PENDING' && (
            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => setOpenAssignDialog(true)}
            >
              Assign Picker
            </Button>
          )}
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Client Information Card */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Client Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Name:</strong> {clientData?.userName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Register Number:</strong> {clientData?.userRegisterNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
                  <Typography variant="body1">
                    <strong>Address:</strong> {clientData?.userAddress}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Pickup Date:</strong> {clientData?.pickupDate}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Pickup Time:</strong> {clientData?.pickupTime}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Approx Value:</strong> ₹{clientData?.approxTrashValue}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScaleIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Quantity:</strong> {clientData?.approxQuantity} kg
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* Trash Types */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Trash Types
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {Object.entries(JSON.parse(clientData?.trashTypeValue || '{}')).map(([type, quantity]) => (
                <Chip
                  key={type}
                  icon={<CategoryIcon />}
                  label={`${type.toUpperCase()}: ${quantity}`}
                  variant="outlined"
                  color="primary"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Trash Details Section */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Trash Details
      </Typography>
      <Grid container spacing={2}>
        {trashDetails.map((item) => (
          <Grid item xs={12} key={item.trashRequestId}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="body1">
                        <strong>Trash Name:</strong> {item.trashName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Trash Type:</strong> {item.trashType}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Typography variant="body1">
                        <strong>Quantity:</strong> {item.trashQuantity} kg
                      </Typography>
                      <Typography variant="body1">
                        <strong>Value:</strong> ₹{item.trashValue}
                      </Typography>
                      {item.trashPickerName && (
                        <Typography variant="body1">
                          <strong>Assigned Picker:</strong> {item.trashPickerName}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Assign Picker Dialog */}
      <Dialog
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <AssignmentIcon color="primary" />
            <Typography variant="h6">Assign Trash Picker</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              select
              label="Select Trash Picker"
              value={selectedPicker}
              onChange={(e) => setSelectedPicker(e.target.value)}
              fullWidth
              required
            >
              {pickers
                .filter(picker => picker.status === 'ACTIVE')
                .map((picker) => (
                  <MenuItem key={picker.trashPickerId} value={picker.trashPickerId}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon fontSize="small" />
                      <Typography>
                        {picker.firstName} {picker.lastName}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setOpenAssignDialog(false)}
            color="inherit"
            disabled={assignLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignPicker}
            variant="contained"
            disabled={!selectedPicker || assignLoading}
            startIcon={assignLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {assignLoading ? 'Assigning...' : 'Assign Picker'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTrashRequestDetails; 