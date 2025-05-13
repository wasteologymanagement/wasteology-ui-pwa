import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Chip, TextField, IconButton, InputAdornment, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { getAllTrashRequestForPickers } from "../../service/apiServices/trashCollectionService";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TrashPickerRequestListPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

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
          color={params.value === "CLIENT_PICKED" ? "success" : "warning"}
          className="capitalize"
        />
      ),
    },
    {
      field: "userAddress",
      headerName: "Address",
      flex: 2,
      renderCell: (params) => (
        <Typography className="whitespace-normal">{params.value}</Typography>
      ),
    },
    {
      field: "pickupDate",
      headerName: "Pickup Date",
      flex: 1,
      valueGetter: (params) => {
        const date = params;
        console.log("date :", params)
        if (!date) return "";
        try {
          return format(new Date(date), "dd/MM/yyyy");
        } catch (error) {
          console.error("Invalid date format:", error);
          return "";
        }
      },
    },
    { field: "pickupTime", headerName: "Pickup Time", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            navigate(`/app/picker/trash-details/${params.row.trashRequestId}`,{
                state: { rowData: params.row }
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
      const response = await getAllTrashRequestForPickers(user.userId);
      setRows(response);
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
  }, [user.userId]);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box className="p-4 mb-10">
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        className="mb-4"
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Trash Requests
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ width: { xs: '100%', sm: 'auto' } }}
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
              width: { xs: '100%', sm: 240 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.5rem',
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
              minWidth: { xs: '100%', sm: 'auto' },
              height: { xs: 40, sm: 36 }
            }}
          >
            {refreshLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Stack>
      </Stack>

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

      <div className="lg:hidden space-y-4">
        {filteredRows.map((row) => (
          <Box
            key={row.trashRequestId}
            className="bg-white rounded-xl shadow-lg p-4 space-y-2 hover:shadow-xl transition"
          >
            <Typography className="font-bold text-lg text-gray-800">
              {row.customerName}
            </Typography>
            <Typography className="text-gray-600">{row.userAddress}</Typography>
            <div className="flex items-center justify-between">
              <Chip
                label={row.status}
                color={row.status === "CLIENT_PICKED" ? "success" : "warning"}
                className="capitalize"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                    navigate(`/app/picker/trash-details/${row.trashRequestId}`,{
                        state: { rowData: row }
                      })
                }
              >
                Details
              </Button>
            </div>
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default TrashPickerRequestListPage;
