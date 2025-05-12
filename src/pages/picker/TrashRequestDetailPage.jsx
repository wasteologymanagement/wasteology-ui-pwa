import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Table,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import {
  getTrashDetailsForPickers,
  submitTrashDetails,
  TrashDetailsAfterPickup,
} from '../../service/apiServices/trashCollectionService';
import { fetchCategories } from '../../service/apiServices/scrapRatesService';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const TrashRequestDetailPage = () => {
  const { trashRequestId } = useParams();
  const location = useLocation();
  const rowData = location.state?.rowData;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entries, setEntries] = useState([
    { type: '', item: '', quantity: 1, price: 0, value: 0 },
  ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [trashData, setTrashData] = useState({});
  const [trashDetails, setTrashDetails] = useState([]);
  const [trashDetailsAfterPickup, setTrashDetailsAfterPickup] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);

  useEffect(() => {
    const fetchTrashTypes = async () => {
      try {
        const response = await fetchCategories();
        const data = response;
        setTrashData(data); // Assuming the API returns an object with trash types as keys
        console.log('trashData : ', data);
        // setLoading(false);
      } catch (err) {
        setError('Failed to load request details');
        // setLoading(false);
      }
    };

    fetchTrashTypes();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getTrashDetailsForPickers(trashRequestId);
        const data = response;
        setTrashDetails(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load request details');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [trashRequestId]);

  useEffect(() => {
    const fetchDetailsAfterPickup = async () => {
      try {
        const response = await TrashDetailsAfterPickup(trashRequestId);
        const data = response;
        setTrashDetailsAfterPickup(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load request details');
        setLoading(false);
      }
    };
    fetchDetailsAfterPickup();
  }, [trashRequestId]);

  const handleAddMore = () => {
    setEntries([
      ...entries,
      { type: '', item: '', quantity: 1, price: 0, value: 0 },
    ]);
  };

  const handleRemove = (index) => {
    if (entries.length === 1) {
      setSnackbarMessage('At least one entry is required!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];

    if (field === 'price') {
      // Convert value to a string, remove leading zeros, but keep '0' if it's the only digit
      let numericValue = value.toString().replace(/^0+(?=\d)/, '');
      numericValue = numericValue === '' ? '0' : numericValue; // Prevent empty value
      newEntries[index][field] = Number(numericValue); // Convert back to number
    } else {
      newEntries[index][field] = value;
    }

    if (field === 'type') {
      newEntries[index].item = '';
      newEntries[index].price = 0;
      newEntries[index].value = 0;
    }

    if (field === 'item') {
      const selectedItem = trashData[newEntries[index].type]?.find(
        (item) => item.title === value
      );
      if (selectedItem) {
        newEntries[index].price = selectedItem.price;
      }
    }

    // Auto-calculate value only if price or quantity is changed
    if (field === 'quantity' || field === 'price') {
      newEntries[index].value =
        newEntries[index].quantity * newEntries[index].price;
    }

    setEntries(newEntries);
  };

  const handleSubmit = async () => {
    try {
      dayjs.extend(customParseFormat);

      // Get the current date and time formatted correctly
      const currentDate = dayjs().format('YYYY/MM/DD'); // e.g., "2025/03/21"
      const currentTime = dayjs().format('hh:mm:ssa'); // e.g., "10:15:30am"

      const requestPayload = {
        userRegisteredNumber: rowData?.userMobileNumber || '',
        pickupDate: currentDate, // Current date in required format
        trashPickerId: rowData?.assignedToTrashPicker || '',
        pickupTime: currentTime, // Current time in required format
        trashPickupId: trashDetails[0]?.trashRequestId || '',
        trashDetailList: entries.map((entry) => ({
          trashName: entry.item || '',
          trashType: entry.type || '',
          trashQuantity: entry.quantity || '',
        })),
      };

      // Log the prepared data for debugging
      console.log('Prepared Data for Submission: ', requestPayload);

      // Submit the object to the API
      const response = await submitTrashDetails(requestPayload);

      // Handle the response
      if (response) {
        setSnackbarMessage('Trash details updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        setSnackbarMessage('Failed to update details');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      // Handle any potential errors
      setSnackbarMessage('Failed to submit trash details');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleReset = () => {
    setEntries([{ type: '', item: '', quantity: 1, price: 0, value: 0 }]);
  };

  const formatDate = (dateStr) => {
    const [yyyy, mm, dd] = dateStr.split('/');
    return `${dd}/${mm}/${yyyy}`;
  };


  const MobileTableCard = ({ data, title }) => (
    <Box sx={{ mt: 2 }}>
      {data.map((item, index) => (
        <Card
          key={index}
          sx={{
            mb: 2,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0',
            '&:last-child': {
              mb: 0
            }
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '0.95rem'
                }}>
                  {item.trashName}
                </Typography>
                {/* <Chip
                  label={item.trashType}
                  size="small"
                  sx={{
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                /> */}
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: 1,
                borderTop: '1px dashed #eee'
              }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Quantity
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.trashQuantity} {item.trashQuantity > 1 ? 'units' : 'unit'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Value
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main'
                    }}
                  >
                    ₹{item.trashValue}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const DesktopTable = ({ data, title }) => (
    <Box sx={{ 
      mt: 2, 
      overflowX: 'auto',
      '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: { xs: '0.875rem', sm: '1rem' }
      },
      '& th, & td': {
        padding: { xs: '8px 4px', sm: '10px' }
      }
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={tableHeaderStyle}>Trash Type</th>
            <th style={tableHeaderStyle}>Trash Name</th>
            <th style={tableHeaderStyle}>Quantity (Kg/Pc)</th>
            <th style={tableHeaderStyle}>Estimated Value (₹)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={{ border: '1px solid #ddd' }}>
              <td style={tableCellStyle}>{item.trashType}</td>
              <td style={tableCellStyle}>{item.trashName}</td>
              <td style={tableCellStyle}>{item.trashQuantity}</td>
              <td style={tableCellStyle}>₹{item.trashValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ 
      padding: { xs: 0, sm: 0 },
      // backgroundColor: '#f4f6f9',
      minHeight: '100vh',
    }}>      
      <Box sx={{ 
        mt: { xs: '10px', sm: 0 },
        mb: { xs: '50px', sm: 0 },
        px: { xs: 0, sm: 0 }
      }}>
        {/* {!isMobile && ( */}
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ mb: 2, color: 'primary.main' }}
          >
            <ArrowBackIcon />
            <Typography
              variant="h6"
              sx={{ ml: 1, fontWeight: 'bold', color: 'primary.main' }}
            >
              Back
            </Typography>
          </IconButton>
        {/* )} */}

        {/* {!isMobile && ( */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Trash Request Details
          </Typography>
        {/* )} */}


        {/* User Request Summary */}
        <Card
          sx={{ 
            mb: 3, 
            boxShadow: { xs: 0, sm: 2 },
            borderRadius: { xs: 0, sm: 1 },
            backgroundColor: '#ffffff'
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              Booking Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  <strong>Customer Name:</strong> {rowData?.customerName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  <strong>Mobile Number:</strong>{' '}
                  {rowData?.userMobileNumber || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  <strong>Pickup Date:</strong>{' '}
                  {trashDetails[0]?.pickupDate || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  <strong>Pickup Time:</strong> {rowData?.pickupTime || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  <strong>Pickup Address:</strong> {rowData?.userAddress || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  <strong>Assigned Picker:</strong>{' '}
                  {trashDetails[0]?.trashPickerName || 'N/A'}
                </Typography>
              </Grid>
            </Grid>

            {/* Replace the existing table with responsive table component */}
            {isMobile ? (
              <MobileTableCard 
                data={trashDetails} 
                title="Requested Items"
              />
            ) : (
              <DesktopTable 
                data={trashDetails} 
                title="Requested Items"
              />
            )}
          </CardContent>
        </Card>

        {rowData?.status !== 'CLIENT_PICKED' && (
          <Box>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                Picked Scraps
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddMore}
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: { xs: 2, sm: 3 }
                }}
              >
                Add Item
              </Button>
            </Box>

            {/* Existing Form for Entering Details */}
            {entries.map((entry, index) => (
              <Card 
                sx={{ 
                  mb: 2, 
                  boxShadow: { xs: 0, sm: 1 },
                  borderRadius: { xs: 0, sm: 1 },
                  border: { xs: '1px solid #eee', sm: 'none' }
                }} 
                key={index}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Type"
                        select
                        fullWidth
                        value={entry.type}
                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: { xs: '8px', sm: '4px' }
                          }
                        }}
                      >
                        {Object.keys(trashData).map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        label="Item"
                        select
                        fullWidth
                        value={entry.item}
                        onChange={(e) => handleChange(index, 'item', e.target.value)}
                        disabled={!entry.type}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: { xs: '8px', sm: '4px' }
                          }
                        }}
                      >
                        {trashData[entry.type]?.map((item) => (
                          <MenuItem key={item.id} value={item.title}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        label="Quantity (Kg/Pc)"
                        select
                        fullWidth
                        value={entry.quantity}
                        onChange={(e) =>
                          handleChange(index, 'quantity', Number(e.target.value))
                        }
                        size={isMobile ? "small" : "medium"}
                      >
                        {[...Array(100).keys()].map((num) => (
                          <MenuItem key={num + 1} value={num + 1}>
                            {num + 1}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Editable Price Field */}
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        label="Price (₹)"
                        fullWidth
                        type="number"
                        value={entry.price === 0 ? '' : entry.price} // Show empty initially if 0
                        onChange={(e) =>
                          handleChange(index, 'price', e.target.value)
                        }
                        onFocus={(e) => {
                          if (entry.price === 0) {
                            handleChange(index, 'price', ''); // Clear only if it's 0
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '') {
                            handleChange(index, 'price', 0); // Reset to 0 if left empty
                          }
                        }}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        label="Value (₹)"
                        fullWidth
                        type="number"
                        value={entry.value}
                        onChange={(e) =>
                          handleChange(index, 'value', Number(e.target.value))
                        }
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>

                    {/* Delete Button */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: { xs: 1, sm: 0 }
                      }}
                    >
                      <IconButton
                        onClick={() => handleRemove(index)}
                        color="error"
                        disabled={entries.length === 1}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          backgroundColor: { xs: '#fff5f5', sm: 'transparent' },
                          '&:hover': {
                            backgroundColor: { xs: '#ffe3e3', sm: 'rgba(0, 0, 0, 0.04)' }
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Box
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 3, 
                mb:10,
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Button 
                variant="outlined" 
                onClick={handleReset}
                fullWidth={isMobile}
                sx={{
                  borderRadius: { xs: '8px', sm: '4px' },
                  py: { xs: 1.5, sm: 1 }
                }}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}
                fullWidth={isMobile}
                sx={{
                  borderRadius: { xs: '8px', sm: '4px' },
                  py: { xs: 1.5, sm: 1 }
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}

        {rowData?.status === 'CLIENT_PICKED' &&
          trashDetailsAfterPickup?.trashDetailDtoAfterPickupList?.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Pickup Summary
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <strong>Request ID:</strong>{' '}
                        {trashDetailsAfterPickup.trashRequestId}
                      </Typography>
                      <Typography>
                        <strong>Date:</strong>{' '}
                        {formatDate(trashDetailsAfterPickup.pickupDate)}
                      </Typography>

                      <Typography>
                        <strong>Time:</strong>{' '}
                        {trashDetailsAfterPickup.pickupTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <strong>Trash Picker:</strong>{' '}
                        {trashDetailsAfterPickup.trashPickerName}
                      </Typography>
                      <Typography>
                        <strong>Total Amount:</strong> ₹
                        {trashDetailsAfterPickup.totalAmount}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Collected Trash Details
                  </Typography>

                  {isMobile ? (
                    <MobileTableCard 
                      data={trashDetailsAfterPickup.trashDetailDtoAfterPickupList}
                      title="Collected Items"
                    />
                  ) : (
                    <DesktopTable 
                      data={trashDetailsAfterPickup.trashDetailDtoAfterPickupList}
                      title="Collected Items"
                    />
                  )}

                  {/* Total Amount Card for Mobile */}
                  {isMobile && (
                    <Card
                      sx={{
                        mt: 2,
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        borderRadius: '12px'
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Total Amount
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            ₹{trashDetailsAfterPickup.totalAmount}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {/* Total Row for Desktop */}
                  {!isMobile && (
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Total Amount: ₹{trashDetailsAfterPickup.totalAmount}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}

        {/* Snackbar for feedback */}
        <Snackbar
          anchorOrigin={{ 
            vertical: isMobile ? 'bottom' : 'top', 
            horizontal: 'center' 
          }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ 
              width: '100%',
              borderRadius: { xs: '8px', sm: '4px' }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>

    </Box>
  );
};

// Table styles
const tableHeaderStyle = {
  padding: '10px',
  fontWeight: 'bold',
  border: '2px solid #ddd',
  textAlign: 'left',
};
const tableCellStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left', // Align text to the center
};

export default TrashRequestDetailPage;
