import React, { useState } from "react";
import {
  Edit,
  Delete,
  Add,
  Email,
  Phone,
  LocationOn,
  Person,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import AddAddressModal from "../../components/AddEditAddressModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  editAddress,
  deleteAddress,
  fetchUserByPhoneNumber,
} from "../../store/slice/userSlice";

const ProfilePage = () => {
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleDialogOpen = (mode = "add", index = null) => {
    setModalMode(mode);
    setEditIndex(index);
    if (mode === "edit" && index !== null) {
      setSelectedAddress(user.userAddress[index]);
    } else {
      setSelectedAddress(null);
    }
    setShowModal(true);
  };

  const handleDialogClose = () => {
    setShowModal(false);
    setEditIndex(null);
    setSelectedAddress(null);
  };

  // Handle close of success message
  const handleCloseSuccessMessage = () => setSuccessMessage("");
  const handleCloseErrorMessage = () => setErrorMessage("");

  const handleAddAddress = async (newAddress) => {
    const addressData = {
      address: newAddress.address,
      city: newAddress.city,
      pinCode: newAddress.pincode,
      userPhoneNumber: user?.mobileNumber,
      userId: user?.userId.toString() || "",
    };
    console.log("add new add : ", addressData);
    try {
      await dispatch(addAddress(addressData)).unwrap();
      setSuccessMessage("Address added successfully");
      dispatch(fetchUserByPhoneNumber(user.mobileNumber)); // Refresh user data
    } catch (error) {
      console.error("Failed to add address:", error);
      if (error.status === 417) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  const handleEditAddress = async(updatedAddress) => {
    const updatedList = [...user.userAddress];
    // updatedList[editIndex] = {
    //   ...updatedAddress,
    //   addressId: updatedList[editIndex].addressId,
    // };
    let currentAddressId = updatedList[editIndex].addressId;
    // setUser({ ...user, userAddress: updatedList });
    console.log("user edit adress : ", updatedList);
    await dispatch(editAddress({ ...updatedAddress, addressId : parseInt(currentAddressId) })).unwrap();
        setSuccessMessage('Address updated successfully');
  };

  const handleDeleteAddress = async (index) => {
    console.log("index : ", index);
    let currentAddressId = index.addressId;
    try {
      await dispatch(
        deleteAddress({
          currentAddressId,
          userId: user?.userId || "",
          userPhoneNumber: user?.mobileNumber,
        })
      ).unwrap();
      setSuccessMessage("Address deleted successfully");
      dispatch(fetchUserByPhoneNumber(user.mobileNumber)); // Refresh user data
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  return (
    <div className="min-h-[180] flex justify-center items-center py-8">
      <div className="w-full max-w-md md:max-w-7xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Profile
        </h2>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
            <Person />
          </Avatar>
          <div>
            <h6 className="font-bold capitalize">
              {user.firstName} {user.lastName}
            </h6>
            <h6 className="text-gray-600">User ID: #{user.userId}</h6>
          </div>
        </div>

        {/* Email & Phone */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <h6 className="text-gray-500 flex items-center mb-1">
              <Email fontSize="small" className="mr-1" />
              Email
            </h6>
            <p>{user.emailId}</p>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h6 className="text-gray-500 flex items-center mb-1">
              <Phone fontSize="small" className="mr-1" />
              Phone
            </h6>
            <p>{user.mobileNumber}</p>
          </Grid>
        </Grid>

        {/* Addresses */}
        <div className="flex items-center justify-between mb-4 mt-20">
          <h4 className="text-gray-800 font-bold">Saved Addresses</h4>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen("add")}
            className="rounded-full"
          >
            Add New
          </Button>
        </div>

        {user.userAddress.length === 0 ? (
          <Typography className="text-gray-500 text-center mt-6">
            No addresses saved yet.
          </Typography>
        ) : (
          user.userAddress.map((addr, idx) => (
            <Card
              key={addr.addressId}
              className="mb-4 rounded-2xl shadow-md bg-white/80 backdrop-blur-sm"
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={10}>
                    <Typography
                      variant="subtitle2"
                      className="text-gray-700 flex items-center"
                    >
                      <LocationOn fontSize="small" className="mr-1" />
                      {addr.address}, {addr.city}, {addr.pinCode}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    className="flex justify-end gap-2 mt-2 sm:mt-0"
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleDialogOpen("edit", idx)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteAddress(addr)}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}

        {/* Address Modal (Add/Edit) */}
        <AddAddressModal
          open={showModal}
          onClose={handleDialogClose}
          onAdd={modalMode === "edit" ? handleEditAddress : handleAddAddress}
          mode={modalMode}
          existingAddress={selectedAddress}
        />
      </div>
      {/* Success Message */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={handleCloseSuccessMessage}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Message */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleCloseErrorMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%" }}
          onClose={handleCloseErrorMessage}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProfilePage;
