import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useEffect, useState } from "react";
import AppRoutes from "./routes/App.Routes";
import 'aos/dist/aos.css';
import AOS from 'aos';
import { ROLES } from "./utils/roleConstants";
import { SnackbarProvider } from "./components/SnackbarProvider"; // ✅ Import your provider

// Simulate authentication state
const getUser = () => {
  return (
    JSON.parse(localStorage.getItem("user")) || {
      isAuthenticated: true,
      role: ROLES.ADMIN,
    }
  );
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider> {/* ✅ Wrap your app in SnackbarProvider */}
          <div className="app">
            <AppRoutes isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
