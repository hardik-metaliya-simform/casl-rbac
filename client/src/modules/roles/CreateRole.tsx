import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container, Stack } from "@mui/material";
import api from "../../services/apiService";
import { useToast } from "../../toast";

export default function CreateRole() {
  const [role, setRole] = useState({ roleName: "", permissionIds: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const show = useToast();

  useEffect(() => {
    // Ensure proper route matching logic is implemented here
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!role.roleName.trim()) {
      show({ message: "Role name is required", severity: "error" });
      return;
    }

    try {
      setLoading(true);
      await api.post("/roles", role);
      show({ message: "Role created successfully", severity: "success" });
      navigate("/roles");
    } catch (err) {
      show({
        message: (err as Error)?.message || "Failed to create role",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} fontWeight={600} color="primary.main">
        Create New Role
      </Typography>
      <Stack spacing={3}>
        <TextField
          label="Role Name"
          name="roleName"
          value={role.roleName}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          error={!role.roleName.trim()}
          helperText={!role.roleName.trim() ? "Role name is required" : ""}
        />
        <TextField
          label="Permission IDs (comma-separated)"
          name="permissionIds"
          value={role.permissionIds}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          helperText="Enter permission IDs separated by commas"
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          {loading ? "Creating..." : "Create Role"}
        </Button>
      </Stack>
    </Container>
  );
}
