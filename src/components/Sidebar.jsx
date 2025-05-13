import { Box, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPerson,
  MdAssignment,
  MdSchedule,
  MdLocalOffer,
  MdGroup,
} from "react-icons/md";
import logo from "../assets/logo/logo4.png"
import short_logo from "../assets/logo/short_logo.png"

const DashboardSidebar = ({ role = "admin", collapsed, setCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const brandPrimary = "#00756d";

  // Define menu items with icons
  const menuItems = {
    admin: [
      { label: "Dashboard", path: "/app/admin/dashboard", icon: <MdDashboard /> },
      { label: "Trash Request", path: "/app/admin/trash-list", icon: <MdAssignment /> },
      { label: "Pickers", path: "/app/admin/pickers-list", icon: <MdGroup /> },
      { label: "Pricing", path: "/app/admin/rates", icon: <MdAssignment /> },
    ],
    picker: [
      { label: "Dashboard", path: "/app/picker/dashboard", icon: <MdDashboard /> },
      { label: "Requests", path: "/app/picker/trash-list", icon: <MdAssignment /> },
      { label: "Profile", path: "/app/picker/profile", icon: <MdPerson /> },
    ],
    user: [
      { label: "Dashboard", path: "/app/user/dashboard", icon: <MdDashboard /> },
      { label: "My Pickups", path: "/app/user/bookings", icon: <MdAssignment /> },
      { label: "Schedule", path: "/app/user/schedule", icon: <MdSchedule /> },
      { label: "Pricing", path: "/app/user/scrap-rates", icon: <MdLocalOffer /> },
      { label: "Profile", path: "/app/user/profile", icon: <MdPerson /> },
    ],
  };

  return (
    <Sidebar
      collapsed={collapsed}
      breakPoint="md"
      backgroundColor="#ffffff"
      className="h-full shadow-2xl"
      rootStyles={{
        color: "#333",
        borderRight: "0px solid #ddd",
      }}
    >
      <Box className="text-center font-bold text-xl h-22 tracking-wide" sx={{
        bgcolor: brandPrimary,
        border: '1px solid',
        borderColor: brandPrimary
      }}>
        {!collapsed ? <img
          src={logo} // Replace this with your actual path
          alt="ScrapDeal Logo"
          className="w-90 h-auto"
        /> : <img
        src={short_logo} // Replace this with your actual path
        alt="ScrapDeal Logo"
        className="w-18 h-auto"
      />}
      </Box>

      <Menu className="p-1 mt-5">
        {menuItems[role]?.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <MenuItem
              key={item.path}
              onClick={() => navigate(item.path)}
              icon={item.icon}
              style={{
                marginBottom: "10px",
                backgroundColor: isActive ? brandPrimary : "transparent",
                color: isActive ? "#fff" : "#333",
                borderRadius: "8px",
                fontWeight: 500,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "#e0f2f1";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </Sidebar>
  );
};

export default DashboardSidebar;
