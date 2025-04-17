import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useEffect, useState } from "react";
import AppRoutes from "./routes/App.Routes";
import 'aos/dist/aos.css';
import AOS from 'aos';



// Simulate authentication state
const getUser = () => {
  return (
    JSON.parse(localStorage.getItem("user")) || {
      isAuthenticated: true,
      role: "admin",
    }
  );
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { isAuthenticated } = getUser();
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <AppRoutes isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
