import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Paper, Typography } from "@mui/material";
import { login, register } from "../../auth";
import { useToast } from "../../toast";

export default function Login() {
  const [u, setU] = useState("alice");
  const [p, setP] = useState("pass");
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const show = useToast();

  const doLogin = async (e: any) => {
    e.preventDefault();
    try {
      await login(u, p);
      show({ message: "Login successful", severity: "success" });
      nav("/posts");
      window.location.reload();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || "Login failed";
      setError(message);
      show({ message, severity: "error" });
    }
  };

  const doRegister = async (e: any) => {
    e.preventDefault();
    try {
      await register(u, p);
      show({ message: "Registered", severity: "success" });
      await login(u, p);
      show({ message: "Login successful", severity: "success" });
      nav("/posts");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || "Register failed";
      setError(message);
      show({ message, severity: "error" });
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 480, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={doLogin}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <TextField
          label="Username"
          value={u}
          onChange={(e) => setU(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          value={p}
          onChange={(e) => setP(e.target.value)}
          type="password"
          fullWidth
        />
        <Box display="flex" gap={2}>
          <Button type="submit" variant="contained">
            Login
          </Button>
          <Button variant="outlined" onClick={doRegister}>
            Register
          </Button>
        </Box>
        {error && (
          <Typography color="error" mt={2} role="alert">
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
