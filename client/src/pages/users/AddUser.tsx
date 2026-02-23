import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Stack,
} from "@mui/material";
import api from "../../services/apiService";
import { useToast } from "../../toast";

export default function AddUser() {
  const [roles, setRoles] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const show = useToast();

  useEffect(() => {
    (async () => {
      const res = await api.get("/roles");
      setRoles(res.data);
    })();
  }, []);

  const handleCreate = async () => {
    if (!username.trim() || !password.trim()) {
      show({
        message: "Username and password are required",
        severity: "error",
      });
      return;
    }
    try {
      setLoading(true);
      await api.post("/users", { username, password, roles: selectedRoles });
      show({ message: "User created", severity: "success" });
      navigate("/users");
    } catch (err: any) {
      show({
        message: err?.message || "Failed to create user",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} color="primary.main" fontWeight={600}>
        Add User
      </Typography>
      <Stack spacing={3}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="roles-label">Assign Roles</InputLabel>
          <Select
            labelId="roles-label"
            multiple
            value={selectedRoles}
            onChange={(e) => setSelectedRoles(e.target.value as string[])}
            input={<OutlinedInput label="Roles" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {(selected as string[]).map((id) => {
                  const r = roles.find((x) => x.id === id);
                  return <Chip key={id} label={r?.name || id} />;
                })}
              </Box>
            )}
          >
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                <Checkbox checked={selectedRoles.indexOf(r.id) > -1} />
                <ListItemText primary={r.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </Button>
      </Stack>
    </Container>
  );
}
