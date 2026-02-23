import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Box,
} from "@mui/material";
import api from "../../services/apiService";
import { useToast } from "../../toast";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const show = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/roles");
        setAvailableRoles(res.data);
      } catch (err) {
        show({ message: "Failed to load roles", severity: "error" });
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      show({
        message: "Username and password are required",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post("/users", { username, password, roles });
      show({ message: "User created successfully", severity: "success" });
      navigate("/users");
    } catch (err) {
      show({
        message: (err as Error)?.message || "Failed to create user",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} fontWeight={600} color="primary.main">
        Create New User
      </Typography>
      <Stack spacing={3}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          variant="outlined"
          error={!username.trim()}
          helperText={!username.trim() ? "Username is required" : ""}
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          fullWidth
          variant="outlined"
          error={!password.trim()}
          helperText={!password.trim() ? "Password is required" : ""}
        />
        <FormControl fullWidth>
          <InputLabel id="roles-label">Assign Roles</InputLabel>
          <Select
            labelId="roles-label"
            multiple
            value={roles}
            onChange={(e) => setRoles(e.target.value as string[])}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {(selected as string[]).map((id) => {
                  const role = availableRoles.find((r) => r.id === id);
                  return <Chip key={id} label={role?.name || id} />;
                })}
              </Box>
            )}
          >
            {availableRoles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          {loading ? "Creating..." : "Create User"}
        </Button>
      </Stack>
    </Container>
  );
}
