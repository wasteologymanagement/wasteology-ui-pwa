import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { getAllTrashRequestForPickers } from "../../service/apiServices/trashCollectionService";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { parseISO, isValid } from "date-fns";
import { useTheme, useMediaQuery } from "@mui/material";

const TrashPickerRequestListPage = () => {
  const authState = useSelector((state) => state.auth);
  const userId = authState?.userId;
  const navigate = useNavigate();

  // Inside component
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // lg and above
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md and below

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "#FFA500"; // Orange
      case "IN_PROGRESS":
        return "#1E90FF"; // Dodger Blue
      case "COMPLETED":
        return "#4BB543"; // Green
      case "CANCELLED":
        return "#FF4C4C"; // Red
      case "PENDING":
        return "#FFD700"; // Gold
      default:
        return "#808080"; // Gray
    }
  };


  const transformResponse = (data) =>
    data.map((item) => ({
      trashRequestId: item.requestId,
      customerName: item.userName,
      userMobileNumber: item.mobileNumber,
      userAddress: `${item.address.addressLine1}, ${item.address.addressLine2}, ${item.address.street}, ${item.address.city}, ${item.address.state}, ${item.address.country}, ${item.address.zip}`,
      pickupDate: item.pickupDate,
      pickupTime: item.pickupTime,
      approxWeight: item.approxWeight,
      status: item.status,
      trashItems: item.trashItems,
      userId: item.userId,
      pickerId: item.pickerId,
      assignmentId: item.assignmentId 
    }));

  const fetchData = async () => {
    try {
      setRefreshLoading(true);
      const response = await getAllTrashRequestForPickers("userId", userId);
      setRows(transformResponse(response.data));
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr);
    return isValid(dateObj) ? format(dateObj, "dd/MM/yyyy") : "";
  };

  const formatTimeWithAmPm = (time24) => {
    if (!time24) return "";

    // Split hours and minutes
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert "0" or "12" to 12-hour format

    return `${hour}:${minute} ${ampm}`;
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    {
      field: "customerName", headerName: "Name", flex: 1, minWidth: 120,
      headerAlign: "center", // center header text
      align: "center",       // center cell content 
    },
    {
      field: "userMobileNumber", headerName: "Phone", flex: 1, minWidth: 120, headerAlign: "center", // center header text
      align: "center",       // center cell content 
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Chip label={params.value} sx={{
          backgroundColor: getStatusColor(params.value),
          color: "#fff",
          fontWeight: "bold",
        }} className="capitalize" size="small" />
      ),
      headerAlign: "center", // center header text
      align: "center",       // center cell content
    },
    {
      field: "userAddress",
      headerName: "Address",
      flex: 2,
      minWidth: 220,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",               // take full cell height
            display: "flex",
            alignItems: "center",         // vertical center
            justifyContent: "center",     // horizontal center
          }}
        >
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              textAlign: "center",
              display: "-webkit-box",
              WebkitLineClamp: 2,        // max 2 lines
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    }

    ,
    {
      field: "pickupDate",
      headerName: "Pickup Date",
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => formatDate(params),
      headerAlign: "center", // center header text
      align: "center",       // center cell content
    },
    {
      field: "pickupTime",
      headerName: "Pickup Time",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => formatTimeWithAmPm(params?.slice(0, 5)),
      headerAlign: "center", // center header text
      align: "center",       // center cell content
    },
    {
      field: "approxWeight",
      headerName: "Weight (Kg)",
      flex: 1,
      minWidth: 110,
      headerAlign: "center", // center header text
      align: "center",       // center cell content
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 150,
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
      headerAlign: "center", // center header text
      align: "center",       // center cell content
    },
  ];

  return (
    <Box className="p-4 pb-16">
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Assigned Trash Requests
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 240 },
              "& .MuiOutlinedInput-root": { borderRadius: "0.5rem" },
              backgroundColor: "#fff",
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

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Desktop DataGrid */}
      <div className="hidden lg:block">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.trashRequestId}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 2,
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #f0f0f0" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f9fafb" },
            "& .MuiDataGrid-footerContainer": { borderTop: "1px solid #f0f0f0" },
          }}
        />
      </div>

      {/* Mobile Card View */}
      {isMobile && (
        <Stack spacing={3} className="lg:hidden">
          {filteredRows.map((row) => (
            <Box
              key={row.trashRequestId}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: "#fff",
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography fontWeight="bold" variant="subtitle1" noWrap>
                  {row.customerName}
                </Typography>
                <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
              </Stack>

              <Typography variant="body2" color="text.secondary" mb={0.5}>
                {row.userAddress}
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Pickup: {formatDate(row.pickupDate)
                } at {row.pickupTime?.slice(0, 5)}
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Phone: {row.userMobileNumber}
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={1}>
                Approx Weight: {row.approxWeight} Kg
              </Typography>

              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() =>
                  navigate(`/app/picker/trash-details/${row.trashRequestId}`, { state: { rowData: row } })
                }
              >
                View Details
              </Button>
            </Box>
          ))}
        </Stack>)}
    </Box>
  );
};

export default TrashPickerRequestListPage;
