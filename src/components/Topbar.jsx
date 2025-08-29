import React, { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "lucide-react";
import logo from "../assets/logo/logo4.png"
import { useDispatch } from "react-redux";
import { logout } from '../store/slice/authSlice';
import { removeTokens } from '../utils/tokensUtils';
import { useNavigate } from "react-router-dom";

const DashboardTopbar = ({ collapsed, setCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const brandPrimary = "#00756d";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const navigate = useNavigate();

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    // localStorage.removeItem('isExistingUser');
    removeTokens();
    navigate('/');
  };

  return (
    <Box
      className="flex justify-between items-center p-1 md:p-4 shadow sticky top-0 z-10"
      sx={{ bgcolor: brandPrimary }}
    >
      <Box className="flex items-center space-x-4">
        {isMobile ? (
          <Typography variant="h6" color="white">
            <img src={logo} alt="Logo" style={{ width: 200 }} />
          </Typography>
        ) : (
          <IconButton onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon size={22} color="white" />
          </IconButton>
        )}
      </Box>

      <Box>
        <IconButton onClick={handleMenuOpen}>
          <Avatar alt="User" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              // logout logic
              handleLogout();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default DashboardTopbar;
