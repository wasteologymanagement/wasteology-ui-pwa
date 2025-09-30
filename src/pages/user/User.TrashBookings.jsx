import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  useMediaQuery,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slice/userSlice";
import { getScheduledPickupDetails } from "../../service/apiServices/pickupRequestService";

const TrashBookings = () => {
  const authState = useSelector((state) => state.auth);
  const userId = authState?.userId;

  const userDetails = useSelector(selectUser);

  const isMobile = useMediaQuery("(max-width:768px)");
  const [tab, setTab] = useState("CREATED");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
    setDialogOpen(false);
  };

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await getScheduledPickupDetails(userId);
          // console.log("Booking response:", response);

          const data = response.map((booking) => ({
            id: booking.requestId,
            date: booking.pickupDate,
            time: booking.pickupTime ? booking.pickupTime.substring(0, 5) : "N/A",
            status: booking.status,
            address: booking.address
              ? `${booking.address.addressLine1}, ${booking.address.addressLine2}, ${booking.address.street}, ${booking.address.city}, ${booking.address.state}, ${booking.address.country}, ${booking.address.zip}`
              : "N/A",
            wasteType: booking.items && booking.items.length
              ? booking.items.map((item) => item.type).join(", ")
              : "N/A",
            weight: booking.approxWeight || "N/A",
          }));

          setBookings(data);
          setLoading(false);
        } catch (err) {
          console.log("Error fetching bookings:", err);
          setError("Failed to fetch bookings");
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    let filtered = [];

    if (tab === "CREATED") {
      filtered = bookings.filter(
        (b) => b.status !== "COMPLETED" && b.status !== "CANCELLED"
      );
    } else if (tab === "COMPLETED") {
      filtered = bookings.filter((b) => b.status === "COMPLETED");
    } else if (tab === "CANCELLED") {
      filtered = bookings.filter((b) => b.status === "CANCELLED");
    }

    setFilteredBookings(filtered);
  }, [tab, bookings]);

  const getStatusChip = (status) => {
    const color =
      status === "COMPLETED"
        ? "success"
        : status === "CANCELLED"
        ? "error"
        : "warning";
    return <Chip label={status} color={color} size="small" variant="outlined" />;
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleOpenDialog(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box className="p-4">
      {/* Header */}
      <Box className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography variant="h5" className="font-bold text-gray-800">
            📋 My Trash Bookings
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/app/user/schedule")}
            className="rounded-xl px-6 py-2 shadow"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              width: isMobile ? "100%" : "auto",
              borderRadius: 10,
            }}
          >
            Book Now
          </Button>
        </motion.div>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          mb: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tab label="Upcoming" value="CREATED" />
        <Tab label="Completed" value="COMPLETED" />
        <Tab label="Cancelled" value="CANCELLED" />
      </Tabs>

      {/* Loading / Error / Content */}
      {loading ? (
        <Box className="flex justify-center items-center h-40">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : !isMobile ? (
        <Box className="rounded-xl shadow-md bg-white p-4">
          <DataGrid
            rows={filteredBookings}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            sx={{
              border: 0,
              fontFamily: "inherit",
              ".MuiDataGrid-columnHeaders": {
                backgroundColor: "#f9fafb",
                fontWeight: "bold",
              },
              ".MuiDataGrid-cell": {
                py: 1,
              },
            }}
          />
        </Box>
      ) : (
        <Box className="flex flex-col gap-4 mt-2">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-sm border border-gray-200 rounded-2xl transition-all hover:shadow-md">
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle1" className="font-semibold">
                      {booking.date}
                    </Typography>
                    {getStatusChip(booking.status)}
                  </div>
                  <Typography className="text-gray-700 text-sm">
                    <span className="font-medium">Time:</span> {booking.time}
                  </Typography>
                  <Typography className="text-gray-700 text-sm">
                    <span className="font-medium">Address:</span> {booking.address}
                  </Typography>
                  <Typography className="text-gray-700 text-sm">
                    <span className="font-medium">Waste:</span> {booking.wasteType} ({booking.weight} kg)
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}

      {/* Booking Detail Dialog */}
      {selectedBooking && (
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Booking Details</DialogTitle>
          <DialogContent dividers className="space-y-3">
            <Typography>
              <strong>ID:</strong> {selectedBooking.id}
            </Typography>
            <Typography>
              <strong>Date:</strong> {selectedBooking.date}
            </Typography>
            <Typography>
              <strong>Time:</strong> {selectedBooking.time}
            </Typography>
            <Typography>
              <strong>Address:</strong> {selectedBooking.address}
            </Typography>
            <Typography>
              <strong>Status:</strong> {selectedBooking.status}
            </Typography>
            <Typography>
              <strong>Waste Type:</strong> {selectedBooking.wasteType}
            </Typography>
            <Typography>
              <strong>Weight:</strong> {selectedBooking.weight} kg
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default TrashBookings;
