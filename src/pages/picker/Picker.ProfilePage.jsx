import React, { useState } from 'react';
import { Box, Typography, Button, Avatar, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const TrashPickerProfilePage = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogType, setDialogType] = useState('');

  const trashPickerData = {
    name: 'Rajesh Kumar',
    mobileNumber: '9876543210',
    profilePic: '',
    areasCovered: [
      { id: 1, area: 'Sector 22, Gurugram' },
      { id: 2, area: 'Connaught Place, Delhi' }
    ],
    vehicles: [
      { id: 1, vehicleNumber: 'HR26D1234', capacity: '100 Kg' },
      { id: 2, vehicleNumber: 'DL5C6789', capacity: '150 Kg' }
    ]
  };

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

  return (
    <Box className="p-4 bg-gray-100 min-h-screen">
      <Box className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <Box className="flex items-center space-x-4">
          <Avatar src={trashPickerData.profilePic} className="w-16 h-16" />
          <Box>
            <Typography variant="h6" className="font-semibold">
              {trashPickerData.name}
            </Typography>
            <Typography className="text-gray-600">{trashPickerData.mobileNumber}</Typography>
          </Box>
        </Box>
      </Box>

      <Box className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <Typography variant="h6" className="font-semibold mb-4">Areas Covered</Typography>
        <Grid container spacing={2}>
          {trashPickerData.areasCovered.map((area) => (
            <Grid item xs={12} sm={6} key={area.id} className="mb-2">
              <Box className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <Typography>{area.area}</Typography>
                <Box className="space-x-2">
                  <IconButton onClick={() => handleOpen('Edit Area', area)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className="bg-white shadow-lg rounded-lg p-6">
        <Typography variant="h6" className="font-semibold mb-4">Vehicles</Typography>
        <Grid container spacing={2}>
          {trashPickerData.vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} key={vehicle.id} className="mb-2">
              <Box className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <Box>
                  <Typography>{vehicle.vehicleNumber}</Typography>
                  <Typography className="text-gray-600">Capacity: {vehicle.capacity}</Typography>
                </Box>
                <Box className="space-x-2">
                  <IconButton onClick={() => handleOpen('Edit Vehicle', vehicle)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{dialogType}</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField label="Details" fullWidth defaultValue={selectedItem?.area || selectedItem?.vehicleNumber || ''} />
          {dialogType.includes('Vehicle') && (
            <TextField label="Capacity" fullWidth defaultValue={selectedItem?.capacity || ''} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrashPickerProfilePage;
