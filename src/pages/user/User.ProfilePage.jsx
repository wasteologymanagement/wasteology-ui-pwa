// src/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUserById,
    selectUser,
    addAddress,
    editAddress,
    deleteAddress,
} from "../../store/slice/userSlice";
import { FiMail, FiPhone, FiMapPin, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const UserProfile = () => {
    const dispatch = useDispatch();

    // get logged-in userId from auth slice
    const authState = useSelector((state) => state.auth);
    const userId = authState?.userId;

    // get user slice state
    const userDetails = useSelector(selectUser);
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);

    // local state for editing/adding address
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        addressLine1: "",
        addressLine2: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    });

    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
        }
    }, [dispatch, userId]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        if (editingAddress) {
            // Edit existing
            dispatch(
                editAddress({
                    ...formData,
                    userId,
                    addressId: editingAddress.addressId,
                    userPhoneNumber: userDetails.mobileNumber,
                })
            );
        } else {
            // Add new
            dispatch(
                addAddress({
                    ...formData,
                    userId,
                    userPhoneNumber: userDetails.mobileNumber,
                })
            );
        }
        setEditingAddress(null);
        setIsFormVisible(false);
        setFormData({
            addressLine1: "",
            addressLine2: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "",
        });
    };

    const handleDelete = (addrId) => {
        dispatch(
            deleteAddress({
                userId,
                currentAddressId: addrId,
                userPhoneNumber: userDetails.mobileNumber,
            })
        );
    };

    if (loading && !userDetails) {
        return (
            <div className="flex justify-center items-center h-full">
                <span className="text-gray-500">Loading user profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full">
                <span className="text-red-500">{error}</span>
            </div>
        );
    }

    if (!userDetails) return null;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
                    {userDetails.firstName?.[0]}
                    {userDetails.lastName?.[0]}
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {`${userDetails.firstName} ${userDetails.lastName}`}
                    </h1>
                    <span className="text-sm text-gray-500 uppercase">
                        {userDetails.role}
                    </span>
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FiMail className="text-gray-500 w-5 h-5" />
                    <span className="text-gray-700 text-sm">{userDetails.email}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FiPhone className="text-gray-500 w-5 h-5" />
                    <span className="text-gray-700 text-sm">{userDetails.mobileNumber}</span>
                </div>
            </div>

            {/* Addresses */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FiMapPin /> Addresses
                </h2>

                {userDetails.addresses?.length > 0 ? (
                    userDetails.addresses.map((addr) => (
                        <div
                            key={addr.addressId}
                            className="p-4 bg-gray-50 rounded-lg text-gray-700 text-sm space-y-1 mb-3"
                        >
                            <div>{addr.addressLine1}</div>
                            <div>{addr.addressLine2}</div>
                            <div>{addr.street}</div>
                            <div>{`${addr.city}, ${addr.state} - ${addr.zip}`}</div>
                            <div>{addr.country}</div>
                            <div className="flex gap-2 justify-end mt-2">
                                <button
                                    onClick={() => {
                                        setEditingAddress(addr);
                                        setFormData(addr);
                                    }}
                                    className="px-2 py-1 flex items-center gap-1 bg-yellow-500 text-white text-xs rounded-lg"
                                >
                                    <FiEdit2 /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr.addressId)}
                                    className="px-2 py-1 flex items-center gap-1 bg-red-600 text-white text-xs rounded-lg"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No addresses available.</p>
                )}

                {/* Add New Address Button */}
                <button
                    onClick={() => {
                        setEditingAddress(null);
                        setIsFormVisible(true);
                        setFormData({
                            addressLine1: "",
                            addressLine2: "",
                            street: "",
                            city: "",
                            state: "",
                            zip: "",
                            country: "",
                        });
                    }}
                    className="mt-3 px-3 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                    <FiPlus /> Add Address
                </button>
            </div>

            {/* Address Form (for add/edit) */}
            {(isFormVisible || editingAddress) && (
                <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    {["addressLine1", "addressLine2", "street", "city", "state", "zip", "country"].map(
                        (field) => (
                            <input
                                key={field}
                                name={field}
                                value={formData[field] || ""}
                                onChange={handleChange}
                                placeholder={field}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                            />
                        )
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setEditingAddress(null);
                                setIsFormVisible(false);
                                setFormData({});
                            }}
                            className="px-3 py-2 bg-gray-400 text-white rounded-lg text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserProfile;
