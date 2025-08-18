import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  TrendingUp,
  People,
  LocalShipping,
  Recycling,
  AttachMoney,
  CalendarToday,
  Refresh,
  Warning,
  CheckCircle,
  Schedule,
  LocationOn,
  Category,
} from '@mui/icons-material';

// Custom Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={2} className="h-full">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <Typography variant="subtitle2" color="textSecondary" className="mb-1">
            {title}
          </Typography>
          <Typography variant="h4" className="font-bold">
            {value}
          </Typography>
        </div>
        <IconButton
          size="small"
          sx={{
            backgroundColor: `${color}15`,
            color: color,
            '&:hover': { backgroundColor: `${color}25` },
          }}
        >
          {icon}
        </IconButton>
      </div>
    </CardContent>
  </Card>
);

// Custom Alert Card Component
const AlertCard = ({ title, message, severity, time }) => (
  <Paper elevation={1} className="p-4 mb-3 border-l-4" sx={{ borderLeftColor: severity === 'high' ? 'error.main' : 'warning.main' }}>
    <div className="flex justify-between items-start">
      <div>
        <Typography variant="subtitle2" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      </div>
      <Typography variant="caption" color="textSecondary">
        {time}
      </Typography>
    </div>
  </Paper>
);

// Detailed Stats Card Component
const DetailedStatsCard = ({ title, items, icon }) => (
  <Card elevation={2} className="h-full">
    <CardContent>
      <div className="flex items-center mb-4">
        <IconButton
          size="small"
          sx={{
            backgroundColor: 'primary.50',
            color: 'primary.main',
            marginRight: 2,
          }}
        >
          {icon}
        </IconButton>
        <Typography variant="h6" className="font-semibold">
          {title}
        </Typography>
      </div>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} className="px-0">
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              secondary={item.value}
              primaryTypographyProps={{ variant: 'subtitle2' }}
              secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Dummy data
  const dashboardData = {
    stats: {
      totalPickups: 156,
      activePickups: 23,
      totalUsers: 1245,
      totalRevenue: '₹45,678',
      collectionRate: '92%',
      pendingRequests: 12,
    },
    alerts: [
      {
        title: 'High Volume Alert',
        message: 'Unusually high number of pickup requests in South Zone',
        severity: 'high',
        time: '2 hours ago',
      },
      {
        title: 'Picker Shortage',
        message: 'Need additional pickers for weekend coverage',
        severity: 'medium',
        time: '4 hours ago',
      },
      {
        title: 'New User Registration',
        message: '25 new users registered in the last hour',
        severity: 'medium',
        time: '1 hour ago',
      },
    ],
    detailedStats: {
      todayStats: [
        { label: 'Completed Pickups', value: '24', icon: <CheckCircle color="success" /> },
        { label: 'Scheduled Pickups', value: '18', icon: <Schedule color="primary" /> },
        { label: 'Pending Pickups', value: '6', icon: <Warning color="warning" /> },
        { label: 'Cancelled Pickups', value: '2', icon: <Warning color="error" /> },
      ],
      locationStats: [
        { label: 'North Zone', value: '45 pickups', icon: <LocationOn color="primary" /> },
        { label: 'South Zone', value: '38 pickups', icon: <LocationOn color="primary" /> },
        { label: 'East Zone', value: '42 pickups', icon: <LocationOn color="primary" /> },
        { label: 'West Zone', value: '31 pickups', icon: <LocationOn color="primary" /> },
        { label: 'Central Zone', value: '28 pickups', icon: <LocationOn color="primary" /> },
      ],
      categoryStats: [
        { label: 'Plastic', value: '35% (₹15,987)', icon: <Category color="info" /> },
        { label: 'Paper', value: '25% (₹11,419)', icon: <Category color="info" /> },
        { label: 'Metal', value: '20% (₹9,135)', icon: <Category color="info" /> },
        { label: 'E-Waste', value: '12% (₹5,481)', icon: <Category color="info" /> },
        { label: 'Others', value: '8% (₹3,654)', icon: <Category color="info" /> },
      ],
    },
  };

  return (
    <Box className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Admin Dashboard
        </Typography>
        <IconButton onClick={() => window.location.reload()}>
          <Refresh />
        </IconButton>
      </div>

      {/* Stats Grid */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Pickups"
            value={dashboardData.stats.totalPickups}
            icon={<LocalShipping />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Active Pickups"
            value={dashboardData.stats.activePickups}
            icon={<TrendingUp />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Users"
            value={dashboardData.stats.totalUsers}
            icon={<People />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Revenue"
            value={dashboardData.stats.totalRevenue}
            icon={<AttachMoney />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Collection Rate"
            value={dashboardData.stats.collectionRate}
            icon={<Recycling />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Pending Requests"
            value={dashboardData.stats.pendingRequests}
            icon={<Warning />}
            color={theme.palette.error.main}
          />
        </Grid>
      </Grid>

      {/* Detailed Stats and Alerts Grid */}
      <Grid container spacing={3}>
        {/* Today's Stats */}
        <Grid item xs={12} md={4}>
          <DetailedStatsCard
            title="Today's Overview"
            items={dashboardData.detailedStats.todayStats}
            icon={<CalendarToday />}
          />
        </Grid>

        {/* Location Stats */}
        <Grid item xs={12} md={4}>
          <DetailedStatsCard
            title="Zone-wise Distribution"
            items={dashboardData.detailedStats.locationStats}
            icon={<LocationOn />}
          />
        </Grid>

        {/* Category Stats */}
        <Grid item xs={12} md={4}>
          <DetailedStatsCard
            title="Waste Categories"
            items={dashboardData.detailedStats.categoryStats}
            icon={<Category />}
          />
        </Grid>

        {/* Alerts Section */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  Recent Alerts
                </Typography>
                <IconButton size="small">
                  <CalendarToday fontSize="small" />
                </IconButton>
              </div>
              <Divider className="mb-4" />
              {dashboardData.alerts.map((alert, index) => (
                <AlertCard key={index} {...alert} />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
