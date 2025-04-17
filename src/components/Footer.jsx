import React from "react";
import {
  Divider,
  Box,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from "@mui/material";
import { Home, AccountCircle, Settings } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const DashboardFooter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navigate("/app/user/dashboard");
    else if (newValue === 1) navigate("/app/user/bookings");
    else if (newValue === 2) navigate("/app/user/schedule");
    else if (newValue === 3) navigate("/app/user/scrap-rates");
    else if (newValue === 4) navigate("/app/user/profile");
  };

  return (
    <Box className="mt-auto bg-white" sx={{ width: '100%' }}>
      {isMobile ? (
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, borderTop: "1px solid #ddd", zIndex: 1300 }}
        >
          <BottomNavigationAction label="Home" icon={<Home />} />
          <BottomNavigationAction label="Bookings" icon={<AccountCircle />} />
          <BottomNavigationAction label="Schedule" icon={<Settings />} />
          <BottomNavigationAction label="Price" icon={<Settings />} />
          <BottomNavigationAction label="Profile" icon={<AccountCircle />} />
        </BottomNavigation>
      ) : (
        <>
          <Divider />
          <Box className="text-center py-4">
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} Scrapify Dashboard. All rights reserved.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DashboardFooter;
