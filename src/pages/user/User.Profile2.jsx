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

import {
  MdCalendarToday,
  MdRecycling,
  MdOutlineStar,
  MdCheckCircle,
  MdNotificationsActive,
  MdAttachMoney,
  MdPerson,
  MdHistory,
  MdEdit,
  MdDelete,
  MdLocationOn,
} from "react-icons/md";

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

  const handleEditAddress = async (updatedAddress) => {
    const updatedList = [...user.userAddress];
    // updatedList[editIndex] = {
    //   ...updatedAddress,
    //   addressId: updatedList[editIndex].addressId,
    // };
    let currentAddressId = updatedList[editIndex].addressId;
    // setUser({ ...user, userAddress: updatedList });
    console.log("user edit adress : ", updatedList);
    await dispatch(
      editAddress({ ...updatedAddress, addressId: parseInt(currentAddressId) })
    ).unwrap();
    setSuccessMessage("Address updated successfully");
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
    // <div className="min-h-[180] flex justify-center items-center py-8">
    //   <div className="w-full max-w-md md:max-w-7xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-300">
    //     <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
    //       Profile
    //     </h2>

    //     {/* User Info */}
    //     <div className="flex items-center gap-4 mb-6">
    //       <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
    //         <Person />
    //       </Avatar>
    //       <div>
    //         <h6 className="font-bold capitalize">
    //           {user.firstName} {user.lastName}
    //         </h6>
    //         <h6 className="text-gray-600">User ID: #{user.userId}</h6>
    //       </div>
    //     </div>

    //     {/* Email & Phone */}
    //     <Grid container spacing={2}>
    //       <Grid item xs={12} sm={6}>
    //         <h6 className="text-gray-500 flex items-center mb-1">
    //           <Email fontSize="small" className="mr-1" />
    //           Email
    //         </h6>
    //         <p>{user.emailId}</p>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <h6 className="text-gray-500 flex items-center mb-1">
    //           <Phone fontSize="small" className="mr-1" />
    //           Phone
    //         </h6>
    //         <p>{user.mobileNumber}</p>
    //       </Grid>
    //     </Grid>

    //     {/* Addresses */}
    //     <div className="flex items-center justify-between mb-4 mt-20">
    //       <h4 className="text-gray-800 font-bold">Saved Addresses</h4>
    //       <Button
    //         variant="contained"
    //         startIcon={<Add />}
    //         onClick={() => handleDialogOpen("add")}
    //         className="rounded-full"
    //       >
    //         Add New
    //       </Button>
    //     </div>

    //     {user.userAddress.length === 0 ? (
    //       <Typography className="text-gray-500 text-center mt-6">
    //         No addresses saved yet.
    //       </Typography>
    //     ) : (
    //       user.userAddress.map((addr, idx) => (
    //         <Card
    //           key={addr.addressId}
    //           className="mb-4 rounded-2xl shadow-md bg-white/80 backdrop-blur-sm"
    //         >
    //           <CardContent>
    //             <Grid container spacing={2}>
    //               <Grid item xs={12} sm={10}>
    //                 <Typography
    //                   variant="subtitle2"
    //                   className="text-gray-700 flex items-center"
    //                 >
    //                   <LocationOn fontSize="small" className="mr-1" />
    //                   {addr.address}, {addr.city}, {addr.pinCode}
    //                 </Typography>
    //               </Grid>
    //               <Grid
    //                 item
    //                 xs={12}
    //                 sm={2}
    //                 className="flex justify-end gap-2 mt-2 sm:mt-0"
    //               >
    //                 <IconButton
    //                   size="small"
    //                   color="primary"
    //                   onClick={() => handleDialogOpen("edit", idx)}
    //                 >
    //                   <Edit />
    //                 </IconButton>
    //                 <IconButton
    //                   size="small"
    //                   color="error"
    //                   onClick={() => handleDeleteAddress(addr)}
    //                 >
    //                   <Delete />
    //                 </IconButton>
    //               </Grid>
    //             </Grid>
    //           </CardContent>
    //         </Card>
    //       ))
    //     )}

    // {/* Address Modal (Add/Edit) */}
    // <AddAddressModal
    //   open={showModal}
    //   onClose={handleDialogClose}
    //   onAdd={modalMode === "edit" ? handleEditAddress : handleAddAddress}
    //   mode={modalMode}
    //   existingAddress={selectedAddress}
    // />
    //   </div>
    //   {/* Success Message */}
    //   <Snackbar
    //     open={Boolean(successMessage)}
    //     autoHideDuration={6000}
    //     onClose={handleCloseSuccessMessage}
    //   >
    //     <Alert
    //       severity="success"
    //       sx={{ width: "100%" }}
    //       onClose={handleCloseSuccessMessage}
    //       anchorOrigin={{ vertical: "top", horizontal: "right" }}
    //     >
    //       {successMessage}
    //     </Alert>
    //   </Snackbar>

    //   {/* Error Message */}
    //   <Snackbar
    //     open={Boolean(errorMessage)}
    //     autoHideDuration={6000}
    //     onClose={handleCloseErrorMessage}
    //     anchorOrigin={{ vertical: "top", horizontal: "right" }}
    //   >
    //     <Alert
    //       severity="error"
    //       sx={{ width: "100%" }}
    //       onClose={handleCloseErrorMessage}
    //     >
    //       {errorMessage}
    //     </Alert>
    //   </Snackbar>
    // </div>
    <>
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Profile</h3>

        {/* User Info Section */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="bg-gray-200 p-4 rounded-full">
            <MdPerson className="text-gray-700 text-4xl" />
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">
              {(user?.firstName || "") + " " + (user?.lastName || "")}
            </p>
            <p className="text-sm text-gray-600">
              Email: {user?.emailId || "Not Available"}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {user?.mobileNumber || "Not Available"}
            </p>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-semibold text-gray-700">Saved Addresses</h4>
            <button
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow hover:bg-green-700 transition"
              onClick={() => handleDialogOpen("add")}
            >
              + Add New
            </button>
          </div>

          <div className="space-y-4">
            {user?.userAddress?.length > 0 ? (
              user.userAddress.map((addr, idx) => (
                <div
                  key={addr.id || idx}
                  className="bg-gray-100 p-4 rounded-xl flex justify-between items-start"
                >
                  <div className="flex items-start gap-3">
                    <MdLocationOn className="text-green-600 text-xl mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {addr?.address || "Address not available"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {addr?.city || "City"} - {addr?.pinCode || "PIN"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleDialogOpen("edit", idx)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteAddress(addr)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-6">
                No addresses saved yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-11/12 max-w-md shadow-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Address
            </h4>

            <div className="space-y-4 mb-4">
              <input
                type="text"
                placeholder="Address"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Pin Code"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newAddress.pinCode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pinCode: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md text-gray-700 border border-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                onClick={handleAddAddress}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} */}
      {/* Address Modal (Add/Edit) */}
      <AddAddressModal
        open={showModal}
        onClose={handleDialogClose}
        onAdd={modalMode === "edit" ? handleEditAddress : handleAddAddress}
        mode={modalMode}
        existingAddress={selectedAddress}
      />
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
    </>
  );
};

export default ProfilePage;
