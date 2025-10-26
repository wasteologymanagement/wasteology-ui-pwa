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
import { getAllTrashMaterials } from '../../service/apiServices/scrapRatesService';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const
  TrashRequestDetailsPage = () => {

    const { trashRequestId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const rowData = location.state?.rowData;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //   const fetchTrashTypes = async () => {
    //     try {
    //       const response = await getAllTrashMaterials();
    //       const data = response;
    //       // setTrashData(data); 
    //       console.log('trashData : ', data);
    //       // setLoading(false);
    //     } catch (err) {
    //       setError('Failed to load request details');
    //       // setLoading(false);
    //     }
    //   };

    //   fetchTrashTypes();
    // }, []);

    const InfoRow = ({ label, value }) => (
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>{label}:</strong> {value || "N/A"}
      </Typography>
    );

    const handlePickupInProgress = () => {
      navigate(`/app/picker/items`, { state: { trashData: rowData } })
    }

    const handleCancelPickup = () => {

    }

    const MobileTableCard = ({ data, title }) => (
      <Box sx={{ mt: 2 }}>
        {data.trashItems.map((item, index) => (
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
                    {item.displayName}
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
                      {item.quantity} {item.unit}
                    </Typography>
                  </Box>
                  {/* <Box sx={{ textAlign: 'right' }}>
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
                  </Box> */}
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
              {/* <th style={tableHeaderStyle}>Estimated Value (₹)</th> */}
            </tr>
          </thead>
          <tbody>
            {data.trashItems.map((item, index) => (
              <tr key={index} style={{ border: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{item.type}</td>
                <td style={tableCellStyle}>{item.displayName}</td>
                <td style={tableCellStyle}>{item.quantity} {item.unit}</td>
                {/* <td style={tableCellStyle}>₹{item.unit}</td> */}
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
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }


    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, pb: { xs: 8, sm: 4 } }}>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2} // space between button and text
          sx={{ mb: 2 }}
        >
          {/* Back Button */}
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon color="primary" />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Trash Request Details
          </Typography>
        </Stack>



        {/* Booking Information */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Booking Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoRow label="Customer" value={rowData?.customerName} />
                <InfoRow label="Mobile" value={rowData?.userMobileNumber} />
                <InfoRow label="Address" value={rowData?.userAddress} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoRow label="Pickup Date" value={rowData?.pickupDate} />
                <InfoRow label="Pickup Time" value={rowData?.pickupTime} />
                <InfoRow
                  label="Assigned Picker"
                  value={rowData?.trashPickerName}
                />
              </Grid>
            </Grid>

            {/* Replace the existing table with responsive table component */}
            {isMobile ? (
              <MobileTableCard
                data={rowData}
                title="Requested Items"
              />
            ) : (
              <DesktopTable
                data={rowData}
                title="Requested Items"
              />
            )}

          </CardContent>
        </Card>

        {/* Submit button only if not picked */}
              {rowData?.status !== "COMPLETED" && (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={isMobile}
                    onClick={handlePickupInProgress}
                  >
                    Start Pickup
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth={isMobile}
                    onClick={handleCancelPickup}
                  >
                    Cancel Pickup
                  </Button>
                </Box>
              )}

      </Box>
    )
  }

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

export default
  TrashRequestDetailsPage