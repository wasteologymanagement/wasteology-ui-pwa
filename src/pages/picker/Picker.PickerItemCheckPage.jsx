import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Stack,
  Checkbox,
  Card,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllTrashMaterials } from "../../service/apiServices/scrapRatesService";
import { completeTrashPickup } from "../../service/apiServices/trashPickersService";

const units = ["KG", "Piece", "Gram", "Litre"];

const PickerItemsPage = () => {
  const location = useLocation();
  const trashRequestDetails = location.state?.trashData;
const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [newItem, setNewItem] = useState({
    type: "",
    displayName: "",
    quantity: "",
    unit: "",
    amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  // ✅ Fetch trash materials from API
  useEffect(() => {
    const fetchTrashTypes = async () => {
      try {
        const response = await getAllTrashMaterials();
        const activeItems = response.data
          .filter((item) => item.active)
          .map((item) => ({
            type: item.type,
            displayName: item.displayName,
            pricePerUnit: item.pricePerUnit,
            unit: item.unit,
          }));
        setAvailableItems(activeItems);
        console.log("Available Items:", activeItems);
      } catch (err) {
        console.error("Failed to fetch trash materials:", err);
      }
    };
    fetchTrashTypes();
  }, []);

  // ✅ Populate existing request items (if editing)
  useEffect(() => {
    if (trashRequestDetails?.trashItems) {
      const mappedItems = trashRequestDetails.trashItems.map((item, index) => ({
        id: item.trashItemId || index + 1,
        displayName: item.displayName || "",
        type: item.type || "",
        quantity: item.quantity || 0,
        unit: item.unit || "",
        amount: item.pricePerUnit || 0,
        checked: false,
        isEditing: false,
      }));
      setItems(mappedItems);
    }
  }, [trashRequestDetails]);

  // ✅ Handle when "Type" changes in the new item form
  const handleTypeChange = (selectedType) => {
    const selected = availableItems.find((i) => i.type === selectedType);
    if (selected) {
      setNewItem({
        ...newItem,
        type: selected.type,
        displayName: selected.displayName,
        unit: selected.unit,
        amount: selected.pricePerUnit,
      });
    } else {
      setNewItem({
        ...newItem,
        type: selectedType,
        displayName: "",
        unit: "",
        amount: "",
      });
    }
  };

  const handleAddItem = () => {
    if (!newItem.type || !newItem.quantity) return;

    setItems((prev) => [
      ...prev,
      { ...newItem, id: Date.now(), checked: false, isEditing: false },
    ]);
    setNewItem({ type: "", displayName: "", quantity: "", unit: "", amount: "" });
  };

  const handleDelete = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const handleCheckboxChange = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  const handleEditToggle = (id, toggle) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isEditing: toggle } : i)));
  const handleEditChange = (id, field, value) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const isSubmitEnabled = items.some((i) => i.checked);

  const grandTotal = items
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.amount) || 0), 0);

  const handleSubmit = async () => {
    const selectedItems = items.filter((i) => i.checked); 
    if (selectedItems.length === 0) { 
      alert("Please select at least one item before submitting."); 
      return; 
    } 
    
    console.log("Submitting items:", selectedItems);

   // Build the payload 
    const payload = {
      assignmentId: trashRequestDetails.assignmentId,
      requestId: trashRequestDetails.trashRequestId,
      userId: trashRequestDetails.userId,
      pickerId: trashRequestDetails.pickerId,
      // pickupDate: trashRequestDetails.pickupDate,
      // pickupTime: trashRequestDetails.pickupTime,
      // approxWeight: trashRequestDetails.approxWeight,
      // status: "COMPLETED",
      totalAmount: grandTotal,
      // items: selectedItems.map((i) => ({
      //   trashItemId: i.id,
      //   displayName: i.displayName,
      //   quantity: Number(i.quantity),
      //   unit: i.unit,
      //   pricePerUnit: Number(i.amount),
      //   totalPrice: Number(i.quantity) * Number(i.amount),
      // })),
    };

    try {
      setIsSubmitting(true);
      console.log("Submitting payload:", payload);
      const response = await completeTrashPickup(payload);
      console.log("✅ Request submitted successfully:", response);
      alert("Request submitted successfully!");
      navigate(-1); 
      // Go back to previous page or dashboard
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      toast.error("Failed to submit request!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="p-4 pb-16">
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Pickup Items
      </Typography>

      {/* Item Cards */}
      <Stack spacing={2} mb={4}>
        {items.map((item) => {
          const totalAmount = (Number(item.quantity) || 0) * (Number(item.amount) || 0);
          return (
            <Card
              key={item.id}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: item.isEditing ? "#e3f2fd" : "#fff",
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Checkbox checked={item.checked} onChange={() => handleCheckboxChange(item.id)} />
                <Box>
                  <Typography fontWeight="bold">{item.displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {item.type}
                  </Typography>
                </Box>
                {!item.isEditing && (
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleEditToggle(item.id, true)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </Stack>
                )}
              </Stack>

              <Divider sx={{ mb: 1 }} />

              {item.isEditing ? (
                <Stack spacing={1}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleEditChange(item.id, "quantity", e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleEditToggle(item.id, false)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleEditToggle(item.id, false)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={0.5}>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  <Typography variant="body2">Unit: {item.unit}</Typography>
                  <Typography variant="body2">₹/Unit: {item.amount}</Typography>
                  <Typography fontWeight="bold">Total: ₹{totalAmount.toFixed(2)}</Typography>
                </Stack>
              )}
            </Card>
          );
        })}
      </Stack>

      {/* Add New Item */}
      <Card sx={{ p: 2, mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6" mb={2}>
          Add New Item
        </Typography>

        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
          {/* Type dropdown */}
          <TextField
            select
            label="Type"
            value={newItem.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            size="small"
            sx={{ width: isMobile ? "100%" : "250px" }}
          >
            {availableItems.map((item) => (
              <MenuItem key={item.type} value={item.type}>
                {item.type}
              </MenuItem>
            ))}
          </TextField>

          {/* Auto-filled fields */}
          <TextField
            label="Display Name"
            value={newItem.displayName}
            size="small"
            sx={{ width: isMobile ? "100%" : "300px" }}
            disabled
          />
          <TextField
            label="Unit"
            value={newItem.unit}
            size="small"
            sx={{ width: isMobile ? "100%" : "150px" }}
            disabled
          />
          <TextField
            label="₹/Unit"
            value={newItem.amount}
            size="small"
            sx={{ width: isMobile ? "100%" : "150px" }}
            disabled
          />

          {/* Quantity input */}
          <TextField
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            size="small"
            sx={{ width: isMobile ? "100%" : "150px" }}
          />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddItem}
            sx={{ alignSelf: isMobile ? "flex-start" : "center" }}
          >
            Add
          </Button>
        </Stack>
      </Card>

      {/* Grand Total + Submit */}
      <Box
        sx={{
          position: isMobile ? "fixed" : "static",
          bottom: isMobile ? 0 : "auto",
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          p: 2,
          boxShadow: isMobile ? "0 -2px 10px rgba(0,0,0,0.1)" : "none",
          borderTop: isMobile ? "1px solid #eee" : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <Typography fontWeight="bold">Grand Total: ₹{grandTotal.toFixed(2)}</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default PickerItemsPage;
