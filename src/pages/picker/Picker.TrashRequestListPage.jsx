import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { getAllTrashRequestForPickers } from "../../service/apiServices/trashCollectionService";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    selectUser,
} from "../../store/slice/userSlice";

const TrashPickerRequestListPage = () => {

  // get logged-in userId from auth slice
  const authState = useSelector((state) => state.auth);
  const userId = authState?.userId;
  const userName = authState?.name;

  // get user slice state
  const userDetails = useSelector(selectUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Status → Color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "warning";
      case "CLIENT_PICKED":
        return "success";
      case "PENDING":
        return "default";
      case "CANCELLED":
        return "error";
      default:
        return "info";
    }
  };

  // ✅ Convert API response → UI row shape
  const transformResponse = (data) => {
    return data.map((item) => ({
      trashRequestId: item.requestId,
      customerName: item.userName,
      userMobileNumber: item.mobileNumber,
      userAddress: `${item.address.addressLine1}, ${item.address.street}, ${item.address.city}`,
      pickupDate: item.pickupDate,
      pickupTime: item.pickupTime,
      approxWeight: item.approxWeight,
      status: item.status,
      trashItems: item.trashItems,
    }));
  };

  const columns = [
    { field: "customerName", headerName: "Name", flex: 1 },
    { field: "userMobileNumber", headerName: "Phone", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          className="capitalize"
        />
      ),
    },
    {
      field: "userAddress",
      headerName: "Address",
      flex: 2,
      renderCell: (params) => (
        <Typography className="whitespace-normal text-gray-700">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "pickupDate",
      headerName: "Pickup Date",
      flex: 1,
      valueGetter: (params) => {
        // console.log("date paream : ", params)
        if (!params) return "";
        return format(new Date(params), "dd/MM/yyyy");
      },
    },
    {
      field: "pickupTime",
      headerName: "Pickup Time",
      flex: 1,
      valueGetter: (params) => {
        if (!params) return "";
        return params.slice(0, 5); // show HH:mm only
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            navigate(`/app/picker/trash-details/${params.row.trashRequestId}`, {
              state: { rowData: params.row },
            })
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setRefreshLoading(true);
      const response = await getAllTrashRequestForPickers('userId', userId);
      console.log("response .....:", response.data)
      setRows(transformResponse(response.data));
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, ['userId', userId]);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box className="p-4 mb-10">
      {/* Header Section */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        className="mb-4"
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Assigned Trash Requests
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <TextField
            size="small"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            className="bg-white rounded-lg"
            sx={{
              width: { xs: "100%", sm: 240 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.5rem",
              },
            }}
          />

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            disabled={refreshLoading}
            fullWidth
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              height: { xs: 40, sm: 36 },
            }}
          >
            {refreshLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </Stack>
      </Stack>

      {/* Desktop DataGrid */}
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <div className="hidden lg:block">
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.trashRequestId}
            autoHeight
            pageSize={5}
            className="bg-white rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredRows.map((row) => (
          <Box
            key={row.trashRequestId}
            className="bg-white rounded-xl shadow-lg p-4 space-y-2 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <Typography className="font-bold text-lg text-gray-800">
                {row.customerName}
              </Typography>
              <Chip
                label={row.status}
                color={getStatusColor(row.status)}
                size="small"
              />
            </div>

            <Typography className="text-gray-600">{row.userAddress}</Typography>

            <Typography className="text-gray-700 text-sm">
              Pickup: {format(new Date(row.pickupDate), "dd/MM/yyyy")} at{" "}
              {row.pickupTime?.slice(0, 5)}
            </Typography>

            <Typography className="text-gray-700 text-sm">
              Phone: {row.userMobileNumber}
            </Typography>

            <Typography className="text-gray-700 text-sm">
              Weight: {row.approxWeight} Kg
            </Typography>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() =>
                navigate(`/app/picker/trash-details/${row.trashRequestId}`, {
                  state: { rowData: row },
                })
              }
            >
              View Details
            </Button>
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default TrashPickerRequestListPage;
