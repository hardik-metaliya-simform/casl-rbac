import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Container,
  Stack,
} from "@mui/material";
import api from "../../services/apiService";
import { useToast } from "../../toast";

export default function EditRole() {
  const { id } = useParams();
  const [modules, setModules] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const show = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [m, p, r] = await Promise.all([
          api.get("/roles/modules"),
          api.get("/roles/permissions"),
          api.get(`/roles/${id}`),
        ]);
        setModules(m.data);
        setPermissions(p.data);
        setSelectedPerms((r.data.permissions || []).map((pp: any) => pp.id));
      } catch (err: any) {
        show({ message: err?.message || "Failed to load", severity: "error" });
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    try {
      await api.put(`/roles/${id}/permissions`, {
        permissionIds: selectedPerms,
      });
      show({ message: "Permissions updated", severity: "success" });
      navigate("/roles");
    } catch (err: any) {
      show({ message: err?.message || "Update failed", severity: "error" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} color="primary.main" fontWeight={600}>
        Edit Role Permissions
      </Typography>
      <Stack spacing={3}>
        {modules.map((m) => (
          <Box key={m.id}>
            <Typography variant="h6" color="primary.main">
              {m.name}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {permissions
                .filter((pp: any) => pp.moduleId === m.id)
                .map((pp: any) => (
                  <FormControlLabel
                    key={pp.id}
                    control={
                      <Checkbox
                        checked={selectedPerms.includes(pp.id)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedPerms((s) => [...s, pp.id]);
                          else
                            setSelectedPerms((s) =>
                              s.filter((x) => x !== pp.id),
                            );
                        }}
                      />
                    }
                    label={pp.action}
                  />
                ))}
            </Box>
          </Box>
        ))}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate("/roles")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
