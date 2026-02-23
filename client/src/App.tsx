import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from "@mui/material";
import AppRouter from "./components/Router";
import { can } from "./services/helperService";

const theme = createTheme();
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              RBAC Demo
            </Typography>
            <Box>
              <Button
                color="inherit"
                href="/posts"
                disabled={!can("read", "posts")}
              >
                Posts
              </Button>
              <Button
                color="inherit"
                href="/users"
                disabled={!can("read", "users")}
              >
                Users
              </Button>
              <Button
                color="inherit"
                href="/roles"
                disabled={!can("read", "roles")}
              >
                Roles
              </Button>
              <Button color="inherit" href="/login">
                Login
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 2 }}>
          <AppRouter></AppRouter>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}
