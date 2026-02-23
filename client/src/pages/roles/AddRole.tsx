import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Stack,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import api from "../../services/apiService";
import { useToast } from "../../toast";

export default function AddRole() {
  const [roleName, setRoleName] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const show = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [m, p] = await Promise.all([
          api.get("/roles/modules"),
          api.get("/roles/permissions"),
        ]);

        setModules(m.data);
        setPermissions(p.data);
      } catch (err: any) {
        show({
          message: err?.message || "Failed to load data",
          severity: "error",
        });
      }
    };

    load();
  }, []);

  const handleCreate = async () => {
    if (!roleName.trim()) {
      show({ message: "Role name is required", severity: "error" });
      return;
    }

    try {
      setLoading(true);

      await api.post("/roles", {
        name: roleName,
        permissionIds: selectedPerms,
      });

      show({ message: "Role created successfully", severity: "success" });
      navigate("/roles");
    } catch (err: any) {
      show({
        message: err?.message || "Failed to create role",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permId: string, checked: boolean) => {
    if (checked) {
      setSelectedPerms((prev) => [...prev, permId]);
    } else {
      setSelectedPerms((prev) => prev.filter((id) => id !== permId));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} color="primary.main" fontWeight={600}>
        Add Role
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          fullWidth
        />

        {/* Permissions Section */}
        {modules.map((module) => (
          <Box key={module.id}>
            <Typography variant="h6" color="primary.main" mb={1}>
              {module.name}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2}>
              {permissions
                .filter((perm: any) => perm.moduleId === module.id)
                .map((perm: any) => (
                  <FormControlLabel
                    key={perm.id}
                    control={
                      <Checkbox
                        checked={selectedPerms.includes(perm.id)}
                        onChange={(e) =>
                          togglePermission(perm.id, e.target.checked)
                        }
                      />
                    }
                    label={perm.action}
                  />
                ))}
            </Box>
          </Box>
        ))}

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate("/roles")}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create Role"}
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
