import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  Slide,
  Button,
  Divider,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo/logo4.png";
import QuickScrapPickupFormDialog from "./QuickScrapPickupFormDialog";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Scrap Rates", path: "/scrap-rates" },
  { label: "About us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact us", path: "/contact" },
  // { label: "Login", path: "/login" },
];

const WebsiteNavbar = () => {
  const isMobile = useMediaQuery("(max-width: 960px)");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Reset active section on route change
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const brandPrimary = "#00756d";
  const brandContrast = "#ffffff";
  const softDivider = "rgba(255, 255, 255, 0.2)";

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          // backgroundColor: "#ffffff",
          // py: 1,
          px: { xs: 2, md: 4 },
          borderBottom: `1px solid ${softDivider}`,
        }}
        // className="bg-green-700"
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Left - Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              // gap: 2,
            }}
          >
            <img
              src={logo}
              alt="ScrapDeal Logo"
              className="w-70"
              // style={{
              //   height: 80,
              //   maxWidth: "400px",
              //   // objectFit: "contain",
              // }}
            />
          </Box>

          {/* Center - Nav Links */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 4 }}>
              {navLinks.map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    // color: brandPrimary,
                    color: activeLink === item.path ? "#F7D54D" : "#ffffff",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    "&:hover": {
                      color: "#F7D54D",
                      // bgcolor: "rgb(0, 81, 76)",
                      // padding: 2
                      // transition: "background-color 0.3s ease",
                      // fontSize: 15,
                      // fontWeight: "bold",
                      // padding: "10px 20px",
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          )}

          {/* Right - CTA Button or Hamburger */}
          {isMobile ? (
            <IconButton
              color="inherit"
              onClick={toggleMenu}
              sx={{
                transition: "transform 0.3s ease",
                transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                color: "bg-white",
              }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: brandPrimary,
                  color: brandContrast,
                  borderColor: brandContrast,
                  borderRadius: 6,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": { backgroundColor: "#005f58" },
                }}
                onClick={handleOpenDialog}
              >
                Book Now
              </Button>

              <Box>
                <Button
                  variant="outlined"
                  sx={{
                    color: brandContrast,
                    borderColor: brandContrast,
                    borderRadius: 6,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#005f58",
                    },
                  }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  Login
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    component={Link}
                    to="/login/customer"
                    onClick={() => setAnchorEl(null)}
                  >
                    Customer Login
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/login/admin"
                    onClick={() => setAnchorEl(null)}
                  >
                    Team Login
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Slide-down Menu */}
      <Slide direction="down" in={menuOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            position: "sticky",
            top: "80px",
            right: 0,
            width: "100%",
            bgcolor: brandContrast,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          <Box
            sx={{
              px: 4,
              py: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {navLinks.map((item) => (
              <Typography
                key={item.path}
                component={Link}
                to={item.path}
                onClick={toggleMenu}
                sx={{
                  fontSize: "1.2rem",
                  color: brandPrimary,
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": {
                    color: "#009688",
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}

            {/* Book Now button on mobile */}
            {/* Book Now button on mobile */}
            <Button
              variant="contained"
              size="medium"
              onClick={handleOpenDialog}
              sx={{
                borderRadius: "30px",
                textTransform: "none",
                backgroundColor: brandPrimary,
                mt: 2,
                "&:hover": { backgroundColor: "#005f5a" },
              }}
            >
              Book Now
            </Button>

            {/* Login dropdown on mobile */}
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1, color: brandPrimary }}
              >
                Login
              </Typography>
              <Button
                fullWidth
                component={Link}
                to="/login/customer"
                onClick={toggleMenu}
                variant="outlined"
                sx={{
                  mb: 1,
                  textTransform: "none",
                  borderColor: brandPrimary,
                  color: brandPrimary,
                  "&:hover": { borderColor: "#005f5a", color: "#005f5a" },
                }}
              >
                Customer Login
              </Button>
              <Button
                fullWidth
                component={Link}
                to="/login/admin"
                onClick={toggleMenu}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: brandPrimary,
                  color: brandPrimary,
                  "&:hover": { borderColor: "#005f5a", color: "#005f5a" },
                }}
              >
                Team Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Slide>

      <QuickScrapPickupFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default WebsiteNavbar;
