import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

// routing
import Routes from "./routes";

// defaultTheme
import themes from "./themes";

// /project imports
import NavigationScroll from "./layout/NavigationScroll";
import ToastNotifications from "./common/ToastNotifications";
import ErrorFallback from "./common/ErrorFallback";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { authCheck } from "./utils/AuthCheck";
import PageNetworkError from "./common/PageNetworkError";

// ==============================|| APP ||============================== //
//
const App = () => {
  const location = useLocation();
  useEffect(() => {
    authCheck();
  }, [location]);

  return (
    <StyledEngineProvider injectFirst>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThemeProvider
          theme={themes({
            fontFamily: `'Montserrat', sans-serif`,
            borderRadius: 4,
          })}
        >
          <CssBaseline />
          {!navigator.onLine ? (
            <PageNetworkError />
          ) : (
            <NavigationScroll>
              <Routes />
              <ToastNotifications />
            </NavigationScroll>
          )}
        </ThemeProvider>
      </ErrorBoundary>
    </StyledEngineProvider>
  );
};

export default App;
