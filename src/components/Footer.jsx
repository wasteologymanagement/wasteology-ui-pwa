import React from "react";
import {
  Divider,
  Box,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from "@mui/material";
import { Home, AccountCircle, Settings, EventNote, MonetizationOn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardFooter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const role = useSelector((state) => state.user.role);
  // const role = "user";

  const menuItems = {
    USER: [
      { label: "Home", icon: <Home />, path: "/app/user/dashboard" },
      { label: "Bookings", icon: <EventNote />, path: "/app/user/bookings" },
      { label: "Schedule", icon: <Settings />, path: "/app/user/schedule" },
      { label: "Price", icon: <MonetizationOn />, path: "/app/user/scrap-rates" },
      { label: "Profile", icon: <AccountCircle />, path: "/app/user/profile" },
    ],
    PICKER: [
      { label: "Home", icon: <Home />, path: "/app/picker/dashboard" },
      { label: "Requests", icon: <EventNote />, path: "/app/picker/trash-list" },
      { label: "Profile", icon: <AccountCircle />, path: "/app/picker/profile" },
    ],
    ADMIN: [
      { label: "Home", icon: <Home />, path: "/app/admin/dashboard" },
      { label: "Requests", icon: <AccountCircle />, path: "/app/admin/trash-request" },
      { label: "Pickers", icon: <EventNote />, path: "/app/admin/pickers-list" },
      { label: "Rates", icon: <MonetizationOn />, path: "/app/admin/rates" },
      // { label: "Settings", icon: <Settings />, path: "/app/admin/settings" },
    ],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(menuItems[role][newValue].path);
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
          {menuItems[role]?.map((item, index) => (
            <BottomNavigationAction key={index} label={item.label} icon={item.icon} />
          ))}
        </BottomNavigation>
      ) : (
        <>
          <Divider />
          <Box className="text-center py-4">
            <Typography variant="body2" color="textSecondary">
              &copy; {new Date().getFullYear()} Wasteology App. All rights reserved.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DashboardFooter;
