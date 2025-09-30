import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TrashDetailsAfterPickup,
  submitTrashDetails,
} from "../../service/apiServices/trashCollectionService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const TrashRequestDetailPage = () => {
  const { trashRequestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const rowData = location.state?.rowData;

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [trashDetailsAfterPickup, setTrashDetailsAfterPickup] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [itemsRequested, setItemsRequested] = useState(rowData?.items || []);

  useEffect(() => {
    // Only fetch after-pickup summary if status is CLIENT_PICKED
    if (rowData?.status === "CLIENT_PICKED") {
      const fetchAfterPickup = async () => {
        setLoading(true);
        try {
          const data = await TrashDetailsAfterPickup(trashRequestId);
          setTrashDetailsAfterPickup(data);
        } catch (err) {
          setSnackbarMessage("Failed to load after pickup summary");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } finally {
          setLoading(false);
        }
      };
      fetchAfterPickup();
    }
  }, [trashRequestId, rowData?.status]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...itemsRequested];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItemsRequested(updatedItems);
  };

  // Add new item 
  const handleAddItem = () => {
    setItemsRequested([...itemsRequested, { trashName: "", trashType: "", trashQuantity: 0, trashValue: 0 },]);
  };

  // Remove item 
  const handleRemoveItem = (index) => {
    const updatedItems = itemsRequested.filter((_, i) => i !== index);
    setItemsRequested(updatedItems);
  };

  const handleSubmit = async () => {
    try {
      dayjs.extend(customParseFormat);
      const currentDate = dayjs().format("YYYY/MM/DD");
      const currentTime = dayjs().format("HH:mm:ss");

      const requestPayload = {
        userRegisteredNumber: rowData?.userMobileNumber || "",
        pickupDate: currentDate,
        trashPickerId: rowData?.assignedToTrashPicker || "",
        pickupTime: currentTime,
        trashPickupId: rowData?.trashRequestId || "",
        trashDetailList: itemsRequested,
      };

      const response = await submitTrashDetails(requestPayload);
      if (response) {
        setSnackbarMessage("Trash details updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => navigate(-1), 1500);
      } else {
        throw new Error();
      }
    } catch (err) {
      setSnackbarMessage("Failed to submit trash details");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

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

  const InfoRow = ({ label, value }) => (
    <Typography variant="body2" sx={{ mb: 1 }}>
      <strong>{label}:</strong> {value || "N/A"}
    </Typography>
  );

  const MobileCardList = ({ data }) => (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {data.map((item, idx) => (
        <Card
          key={idx}
          sx={{
            borderRadius: 2,
            border: "1px solid #eee",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {item.trashName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.trashType}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">
                Qty: {item.trashQuantity}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ₹{item.trashValue || 0}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, pb: { xs: 8, sm: 4 } }}>
      {/* Back Button */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon color="primary" />
      </IconButton>

      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Trash Request Details
      </Typography>

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
        </CardContent>
      </Card>

      {/* Requested Items */}
      {rowData?.items?.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Requested Items
          </Typography>
          <MobileCardList data={rowData.items} />
        </Box>
      )}

      {/* After Pickup Summary */}
      {rowData?.status === "CLIENT_PICKED" &&
        trashDetailsAfterPickup?.trashDetailDtoAfterPickupList?.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Pickup Summary
                </Typography>
                <InfoRow
                  label="Total Amount"
                  value={`₹${trashDetailsAfterPickup.totalAmount}`}
                />
                <Divider sx={{ my: 2 }} />
                <MobileCardList
                  data={trashDetailsAfterPickup.trashDetailDtoAfterPickupList}
                />
              </CardContent>
            </Card>
          </Box>
        )}

      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Items Requested
          </Typography>
          {itemsRequested.map((item, index) =>
          (<Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={3}>
              <input
                type="text"
                placeholder="Trash Name"
                value={item.trashName}
                onChange={(e) => handleItemChange(index, "trashName", e.target.value)}
                className="w-full border rounded p-2" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <input
                type="text"
                placeholder="Trash Type"
                value={item.trashType}
                onChange={(e) => handleItemChange(index, "trashType", e.target.value)}
                className="w-full border rounded p-2" />
            </Grid>
            <Grid item xs={12} sm={2}>
              <input
                type="number"
                placeholder="Qty"
                value={item.trashQuantity}
                onChange={(e) => handleItemChange(index, "trashQuantity", e.target.value)}
                className="w-full border rounded p-2" />
            </Grid>
            <Grid item xs={12} sm={2}>
              <input type="number"
                placeholder="Value"
                value={item.trashValue}
                onChange={(e) => handleItemChange(index, "trashValue", e.target.value)}
                className="w-full border rounded p-2" />
            </Grid>
            <Grid item xs={12} sm={2}>
              <IconButton color="error"
                onClick={() => handleRemoveItem(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
          ))}
          <Button startIcon={<AddIcon />} variant="outlined"
            onClick={handleAddItem} >
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Submit button only if not picked */}
      {rowData?.status !== "CLIENT_PICKED" && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="outlined"
            fullWidth={isMobile}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth={isMobile}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: isMobile ? "bottom" : "top",
          horizontal: "center",
        }}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TrashRequestDetailPage;
