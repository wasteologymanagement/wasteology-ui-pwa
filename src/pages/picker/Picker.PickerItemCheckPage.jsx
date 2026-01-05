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
import { completeTrashPickup, addNewItems } from "../../service/apiServices/trashPickersService";

const PickerItemsPage = () => {
  const location = useLocation();
  const trashRequestDetails = location.state?.trashData;
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [items, setItems] = useState([]);
  const [materialsByType, setMaterialsByType] = useState({});
  const [types, setTypes] = useState([]);

  const [newItem, setNewItem] = useState({
    type: "",
    displayName: "",
    unit: "",
    amount: "",
    quantity: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // Fetch & group materials
  // =========================
  useEffect(() => {
    const fetchTrashTypes = async () => {
      try {
        const response = await getAllTrashMaterials();

        const activeItems = response.data.filter(item => item.active);

        const grouped = activeItems.reduce((acc, item) => {
          if (!acc[item.type]) acc[item.type] = [];
          acc[item.type].push(item);
          return acc;
        }, {});

        setMaterialsByType(grouped);
        setTypes(Object.keys(grouped));
      } catch (err) {
        console.error("Failed to fetch trash materials:", err);
      }
    };

    fetchTrashTypes();
  }, []);

  // =========================
  // Populate existing items
  // =========================
  useEffect(() => {
    if (trashRequestDetails?.trashItems) {
      const mappedItems = trashRequestDetails.trashItems.map((item, index) => ({
        id: item.trashItemId || index + 1,
        displayName: item.displayName,
        type: item.type,
        quantity: item.quantity,
        unit: item.unit,
        amount: item.pricePerUnit,
        checked: false,
        isEditing: false,
      }));
      setItems(mappedItems);
    }
  }, [trashRequestDetails]);

  // =========================
  // Handlers
  // =========================
  const handleTypeChange = (type) => {
    setNewItem({
      type,
      displayName: "",
      unit: "",
      amount: "",
      quantity: "",
    });
  };

  const handleDisplayNameChange = (displayName) => {
    const selected = materialsByType[newItem.type]?.find(
      item => item.displayName === displayName
    );

    if (!selected) return;

    setNewItem(prev => ({
      ...prev,
      displayName: selected.displayName,
      unit: selected.unit,
      amount: selected.pricePerUnit,
    }));
  };

  const handleAddItem = async () => {
  if (!newItem.type || !newItem.displayName || !newItem.quantity) {
    alert("Please fill all required fields");
    return;
  }

  const payload = {
    requestId: trashRequestDetails.trashRequestId,
    userId: trashRequestDetails.userId,
    pickerId: trashRequestDetails.pickerId,
    type: newItem.type,
    displayName: newItem.displayName,
    unit: newItem.unit,
    pricePerUnit: newItem.amount,
    quantity: Number(newItem.quantity),
  };

  try {
    setIsSubmitting(true);

    console.log("payload for new item : ", payload)

    const response = await addNewItems(payload);

    const savedItem = response.data;

    // Add to UI only after DB success
    setItems(prev => [
      ...prev,
      {
        id: savedItem.trashItemId, // from backend
        displayName: savedItem.displayName,
        type: savedItem.type,
        unit: savedItem.unit,
        amount: savedItem.pricePerUnit,
        quantity: savedItem.quantity,
        checked: false,
        isEditing: false,
      },
    ]);

    setNewItem({
      type: "",
      displayName: "",
      unit: "",
      amount: "",
      quantity: "",
    });

  } catch (error) {
    console.error(error);
    alert("Failed to add item");
  } finally {
    setIsSubmitting(false);
  }
};


  const handleDelete = (id) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const handleCheckboxChange = (id) =>
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i)
    );

  const handleEditToggle = (id, toggle) =>
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, isEditing: toggle } : i)
    );

  const handleEditChange = (id, field, value) =>
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, [field]: value } : i)
    );

  const isSubmitEnabled = items.some(i => i.checked);

  const grandTotal = items
    .filter(i => i.checked)
    .reduce(
      (sum, i) => sum + Number(i.quantity || 0) * Number(i.amount || 0),
      0
    );

  // =========================
  // Submit
  // =========================
  const handleSubmit = async () => {
    const selectedItems = items.filter(i => i.checked);
    if (!selectedItems.length) return alert("Select at least one item");

    const payload = {
      assignmentId: trashRequestDetails.assignmentId,
      requestId: trashRequestDetails.trashRequestId,
      userId: trashRequestDetails.userId,
      pickerId: trashRequestDetails.pickerId,
      totalAmount: grandTotal,
    };

    try {
      setIsSubmitting(true);
      await completeTrashPickup(payload);
      console.log("submit payload : ", payload);
      alert("Pickup completed successfully");
      navigate(`/app/picker/submission-success`);
    } catch (e) {
      console.error(e);
      alert("Failed to submit pickup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="p-4 pb-16">
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Pickup Items
      </Typography>

      {/* ================= Item Cards ================= */}
      <Stack spacing={2} mb={4}>
        {items.map(item => {
          const total = item.quantity * item.amount;
          return (
            <Card key={item.id} sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Stack direction="row" justifyContent="space-between">
                <Checkbox
                  checked={item.checked}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <Box flex={1}>
                  <Typography fontWeight="bold">{item.displayName}</Typography>
                  <Typography variant="body2">Type: {item.type}</Typography>
                </Box>
                <IconButton onClick={() => handleEditToggle(item.id, true)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(item.id)}>
                  <Delete color="error" />
                </IconButton>
              </Stack>

              <Divider sx={{ my: 1 }} />

              {item.isEditing ? (
                <TextField
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleEditChange(item.id, "quantity", e.target.value)
                  }
                  size="small"
                />
              ) : (
                <>
                  <Typography>Qty: {item.quantity}</Typography>
                  <Typography>₹/Unit: {item.amount}</Typography>
                  <Typography fontWeight="bold">
                    Total: ₹{total.toFixed(2)}
                  </Typography>
                </>
              )}
            </Card>
          );
        })}
      </Stack>

      {/* ================= Add Item ================= */}
      <Card sx={{ p: 2, boxShadow: 3 }}>
        <Typography variant="h6" mb={2}>
          Add New Item
        </Typography>

        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
          <TextField
            select
            label="Type"
            value={newItem.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            size="small"
             sx={{
              width: 250,          // px
              // or: width: "300px"
            }}
          >
            {types.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Display Name"
            value={newItem.displayName}
            onChange={(e) => handleDisplayNameChange(e.target.value)}
            disabled={!newItem.type}
            size="small"
            sx={{
              width: 250,          // px
              // or: width: "300px"
            }}
          >
            {(materialsByType[newItem.type] || []).map(item => (
              <MenuItem key={item.id} value={item.displayName}>
                {item.displayName}
              </MenuItem>
            ))}
          </TextField>


          <TextField label="Unit" value={newItem.unit} disabled size="small"  sx={{
              width: 100,          // px
              // or: width: "300px"
            }} />
          <TextField label="₹/Unit" value={newItem.amount} disabled size="small"  sx={{
              width: 150,          // px
              // or: width: "300px"
            }} />

          <TextField
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem(prev => ({ ...prev, quantity: e.target.value }))
            }
            size="small"
          />

          <Button variant="contained" startIcon={<Add />} onClick={handleAddItem}>
            Add
          </Button>
        </Stack>
      </Card>

      {/* ================= Footer ================= */}
      <Box
        sx={{
          position: isMobile ? "fixed" : "static",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: "#fff",
          boxShadow: isMobile ? "0 -2px 10px rgba(0,0,0,0.1)" : "none",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight="bold">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="success"
          disabled={!isSubmitEnabled || isSubmitting}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default PickerItemsPage;
