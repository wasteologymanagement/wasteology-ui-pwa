import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
  Container,
  Snackbar,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  AdminPanelSettings as AdminIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slice/userSlice';
import { authenticateUser } from '../../service/apiServices/authService';
import { loginApi } from '../../service/apiServices/loginService';
import { saveTokens } from '../../utils/tokensUtils';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (openSnackbar) setOpenSnackbar(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setAlertMessage("Please enter both username and password");
      setAlertType("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      const loginResponse = await loginApi({ username, password });

      if (!loginResponse) {
        setAlertMessage("Login failed. Please try again.");
        setAlertType("error");
        setOpenSnackbar(true);
        return;
      }

      const response = await authenticateUser(password);

      if (!response || !response.accessToken) {
        setAlertMessage("Authentication failed. Please try again.");
        setAlertType("error");
        setOpenSnackbar(true);
        return;
      }

      saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      if (loginResponse.userRole === "admin") {
        dispatch(
          loginSuccess({
            role: loginResponse.userRole,
            ...loginResponse,
          })
        );
        navigate("/app/admin/dashboard");
      } else if (loginResponse.userRole === "wl-user") {
        dispatch(
          loginSuccess({
            role: "picker",
            ...loginResponse,
          })
        );
        navigate("/app/picker/dashboard");
      } else {
        setAlertMessage("Unauthorized user role.");
        setAlertType("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlertMessage("An error occurred. Please try again.");
      setAlertType("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        pt: { xs: 0, sm: 1, md: 1 },
        pb: { xs: 2, sm: 2, md: 2 },
        px: { xs: 1.5, sm: 2, md: 2 },
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          height: { xs: 'auto', sm: 'auto' },
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mt: { xs: 1, sm: 0 },
          py: { xs: 0, sm: 1 }
        }}
      >
        <Fade in timeout={500}>
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              borderRadius: { xs: 2, sm: 3 },
              overflow: 'hidden',
              position: 'relative',
              mt: { xs: 0, sm: 0 },
              maxHeight: { xs: 'auto', sm: 'calc(100vh - 32px)' },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Card sx={{ border: 'none', boxShadow: 'none' }}>
              <CardContent sx={{ 
                p: { 
                  xs: 2, 
                  sm: 3 
                },
                '&:last-child': {
                  pb: { xs: 2, sm: 3 }
                }
              }}>
                {/* Header Section */}
                <Stack
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: { xs: 2, sm: 3 } }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AdminIcon sx={{ 
                      fontSize: { xs: 24, sm: 28 },
                      color: 'white' 
                    }} />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.5rem', sm: '1.75rem' }
                    }}
                  >
                    Team Login
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Login using your credentials
                  </Typography>
                </Stack>

                <form onSubmit={handleLogin}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ fontSize: { xs: 20, sm: 24 } }} color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ fontSize: { xs: 20, sm: 24 } }} color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              color="action"
                              size="small"
                            >
                              {showPassword ? 
                                <VisibilityOffIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> : 
                                <VisibilityIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                              }
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
                      disabled={loading}
                      startIcon={loading ? 
                        <CircularProgress size={18} /> : 
                        <LoginIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                      }
                      sx={{
                        py: { xs: 1, sm: 1.25 },
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 600,
                        boxShadow: 2,
                        '&:hover': {
                          boxShadow: 4,
                        },
                      }}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Stack>
                </form>

                {/* Footer */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="center"
                  sx={{ 
                    mt: { xs: 2, sm: 3 },
                    display: 'block',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  By continuing, you agree to our <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms</span>{" "}
                  and <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Fade>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertType}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLoginPage;
