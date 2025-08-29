import React, { useState, useEffect } from 'react';
import {
  Avatar, Box, Button, Card, CardContent, Container, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, IconButton, Typography, TextField, Stack,
  CircularProgress, Chip, Divider, Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getPickerProfilebyPickerUserId } from '../../service/apiServices/trashPickersService';
import { useSelector } from "react-redux";

const TrashPickerProfilePage = () => {
  const authState = useSelector((state) => state.auth);
  const userId = authState?.userId;

  console.log("user state : ", authState);
  
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await getPickerProfilebyPickerUserId(userId);
        setProfile(res?.data || res);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleOpen = (type, item) => {
    setDialogType(type);
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setDialogType('');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">No profile data available.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Avatar
              sx={{ width: 70, height: 70 }}
              src="/default-avatar.png"
              alt={profile.firstName}
            />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography color="text.secondary">
                {profile.mobileNumber}
              </Typography>
              <Typography color="text.secondary">
                {profile.email}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Summary Info */}
      <Card sx={{ mb: 4 }} elevation={1}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Employee Code</Typography>
              <Typography>{profile.employeeCode || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Assigned Date</Typography>
              <Typography>{formatDate(profile.assignedDate)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Zone</Typography>
              <Chip
                label={profile.assignedZone || 'Unassigned'}
                color={profile.assignedZone ? 'primary' : 'default'}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Employment Type</Typography>
              <Chip
                label={profile.employmentType || 'Not Set'}
                variant="outlined"
                color={profile.employmentType ? 'success' : 'default'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
              <Chip
                label={profile.status}
                color={profile.status === 'ACTIVE' ? 'success' : 'error'}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Total Collected</Typography>
              <Typography fontWeight={600}>{profile.totalCollectedTillDate || 0} Kg</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Areas Covered */}
      <Card elevation={1} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Areas Covered</Typography>
          <Divider sx={{ mb: 2 }} />
          {!profile.areaCovered || profile.areaCovered.length === 0 ? (
            <Typography color="text.secondary">No areas assigned yet.</Typography>
          ) : (
            <Stack spacing={1}>
              {profile.areaCovered.map((area, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    bgcolor: '#f9f9f9',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography>{area}</Typography>
                  <Box>
                    <IconButton onClick={() => handleOpen('Edit Area', area)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Vehicles */}
      <Card elevation={1}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Vehicles</Typography>
          <Divider sx={{ mb: 2 }} />
          {!profile.vehicles || profile.vehicles.length === 0 ? (
            <Typography color="text.secondary">No vehicles assigned.</Typography>
          ) : (
            <Grid container spacing={2}>
              {profile.vehicles.map(vehicle => (
                <Grid item xs={12} sm={6} key={vehicle.id}>
                  <Card sx={{ bgcolor: '#f5f5f5' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {vehicle.vehicleNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Type: {vehicle.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Capacity: {vehicle.capacity} Kg
                      </Typography>
                      <Chip
                        label={vehicle.available ? 'Available' : 'Unavailable'}
                        color={vehicle.available ? 'success' : 'error'}
                        size="small"
                      />
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleOpen('Edit Vehicle', vehicle)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{dialogType}</DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <TextField
            label="Details"
            fullWidth
            defaultValue={selectedItem?.area || selectedItem?.vehicleNumber || ''}
            sx={{ mb: 2 }}
          />
          {dialogType.includes('Vehicle') && (
            <TextField
              label="Capacity (Kg)"
              fullWidth
              defaultValue={selectedItem?.capacity || ''}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrashPickerProfilePage;
