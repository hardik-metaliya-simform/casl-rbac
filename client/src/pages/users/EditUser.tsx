import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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
  TextField,
} from "@mui/material";
import api from "../../services/apiService";
import { useToast } from "../../toast";

export default function EditUser() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const show = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch roles and user data concurrently
        const [r, u] = await Promise.all([
          api.get("/roles"), // Fetch available roles
          api.get(`/users/${id}`), // Fetch user data by ID
        ]);

        setRoles(r.data); // Set roles available to assign
        setSelectedRoles((u.data.roles || []).map((rr: any) => rr.id)); // Pre-select current roles
        setUsername(u.data.username); // Set current username
      } catch (err: any) {
        show({ message: err?.message || "Failed to load", severity: "error" });
      }
    };

    load();
  }, [id]);

  const handleSave = async () => {
    // Ensure username is not empty before saving
    if (!username.trim()) {
      show({ message: "Username cannot be empty", severity: "error" });
      return;
    }

    try {
      setLoading(true);

      // Update user data with selected roles
      await api.put(`/users/${id}`, {
        username,
        roleIds: selectedRoles, // Send selected roles as an array of IDs
      });

      show({ message: "User updated", severity: "success" });
      navigate("/users"); // Redirect to user list page after saving
    } catch (err: any) {
      show({ message: err?.message || "Update failed", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} color="primary.main" fontWeight={600}>
        Edit User
      </Typography>
      <Stack spacing={3}>
        {/* Username Input */}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />

        {/* Roles Selection */}
        <FormControl fullWidth>
          <InputLabel id="roles-label">Roles</InputLabel>
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

        {/* Buttons for saving or cancelling */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate("/users")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading} // Disable button while saving
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
