import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Button,
  Tooltip,
  LinearProgress,
  Stack,
  Avatar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  InputAdornment,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingActionsIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { getAllTrashRequestForPickers } from '../../service/apiServices/trashCollectionService';

const StatusChip = ({ status, isPickupDone }) => {
  const getStatusColor = (status, isPickupDone) => {
    if (isPickupDone) return 'success';
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

  const getStatusIcon = (status, isPickupDone) => {
    if (isPickupDone) return <CheckCircleIcon fontSize="small" />;
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
      icon={getStatusIcon(status, isPickupDone)}
      label={isPickupDone ? 'PICKUP DONE' : status}
      color={getStatusColor(status, isPickupDone)}
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

const AdminTrashPickerClientList = () => {
  const { pickerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pickerData = location.state?.pickerData;

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, [pickerId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter((client) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          client.customerName?.toLowerCase().includes(searchLower) ||
          client.userAddress?.toLowerCase().includes(searchLower) ||
          client.city?.toLowerCase().includes(searchLower) ||
          client.status?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getAllTrashRequestForPickers(pickerId);
      setClients(response);
      setFilteredClients(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch client list');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshLoading(true);
      await fetchClients();
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleClientClick = (client) => {
    navigate(`/app/admin/trash-requests/${client.trashCollectionId}`, {
      state: { rowData: client }
    });
  };

  if (loading && !clients.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, mb: { xs: "50px", sm: 0 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => navigate(-1)} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Stack>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Assigned Clients
            </Typography>
            {pickerData && (
              <Typography variant="subtitle2" color="text.secondary">
                {pickerData.firstName} {pickerData.lastName}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            '& .MuiTextField-root': {
              width: { xs: '100%', sm: 200 }
            }
          }}
        >
          <TextField
            size="small"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshLoading}
            fullWidth
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' },
              height: { xs: 40, sm: 36 }
            }}
          >
            {refreshLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Clients List */}
      <Stack spacing={2}>
        {filteredClients.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            py={4}
          >
            {searchQuery ? 'No matching clients found' : 'No clients assigned'}
          </Typography>
        ) : (
          filteredClients.map((client) => (
            <Card
              key={client.trashCollectionId}
              onClick={() => handleClientClick(client)}
              sx={{
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  {/* Client Info */}
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main',
                            fontSize: '1.5rem',
                          }}
                          src={client.photoUrl}
                        >
                          {client.customerName?.[0]}
                        </Avatar>
                        <Stack>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {client.customerName}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {client.userAddress}, {client.city}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>

                      {/* Contact and Details */}
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2 }}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Chip
                          icon={<CalendarTodayIcon />}
                          label={`Date: ${client.pickupDate}`}
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={`Time: ${client.pickupTime}`}
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          icon={<AttachMoneyIcon />}
                          label={`Value: ₹${client.approxValue}`}
                          variant="outlined"
                          size="small"
                        />
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* Status and Progress */}
                  <Grid item xs={12} md={4}>
                    <Stack
                      spacing={2}
                      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                    >
                      <StatusChip
                        status={client.status}
                        isPickupDone={client.isPickupDone}
                      />
                      {!client.isPickupDone && (
                        <Box sx={{ width: '100%', maxWidth: 200 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 0.5, display: 'block' }}
                          >
                            Pickup Progress
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={30}
                            color="warning"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default AdminTrashPickerClientList; 