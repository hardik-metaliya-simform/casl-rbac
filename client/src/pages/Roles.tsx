import { useEffect, useState } from "react";
import api from "../services/apiService";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useToast } from "../toast";

export default function Roles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [newRole, setNewRole] = useState("");
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const show = useToast();

  const load = async () => {
    try {
      const [r, m, p] = await Promise.all([
        api.get("/users/roles"),
        api.get("/users/modules"),
        api.get("/users/permissions"),
      ]);
      setRoles(r.data);
      setModules(m.data);
      setPermissions(p.data);
    } catch (err: any) {
      show({ message: err?.message || "Failed to load", severity: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createRole = async () => {
    if (!newRole.trim()) {
      show({ message: "Role name is required", severity: "error" });
      return;
    }
    try {
      await api.post("/users/roles", { name: newRole });
      show({ message: "Role created", severity: "success" });
      setNewRole("");
      load();
    } catch (err: any) {
      show({
        message: err?.response?.data?.message || err.message || "Create failed",
        severity: "error",
      });
    }
  };

  const startEdit = (role: any) => {
    setEditingRole(role.id);
    setSelectedPerms((role.permissions || []).map((p: any) => p.id));
  };

  const savePermissions = async () => {
    if (!editingRole) return;
    try {
      await api.put(`/users/roles/${editingRole}/permissions`, {
        permissionIds: selectedPerms,
      });
      show({ message: "Permissions updated", severity: "success" });
      setEditingRole(null);
      load();
    } catch (err: any) {
      show({
        message: err?.response?.data?.message || err.message || "Update failed",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", p: 3, borderRadius: 2 }}>
      <Typography variant="h4" mb={3} color="primary.main" fontWeight={600}>
        Roles Management
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                Create New Role
              </Typography>
              <Box mt={2} display="flex" gap={2}>
                <TextField
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  label="Role Name"
                  fullWidth
                  variant="outlined"
                  error={!newRole.trim()}
                  helperText={!newRole.trim() ? "Role name is required" : ""}
                />
                <Button
                  variant="contained"
                  onClick={createRole}
                  sx={{
                    backgroundColor: "primary.main",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  Create Role
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {roles.map((r) => (
          <Grid item xs={12} md={6} key={r.id}>
            <Card elevation={3} sx={{ borderRadius: 2, p: 2 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary.main"
                  >
                    {r.name}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => startEdit(r)}
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": { backgroundColor: "primary.light" },
                    }}
                  >
                    Manage Permissions
                  </Button>
                </Box>
                {editingRole === r.id && (
                  <Box mt={3}>
                    {modules.map((m) => (
                      <Box key={m.id} mb={2}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {m.name}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
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
                    <Box
                      mt={2}
                      display="flex"
                      justifyContent="flex-end"
                      gap={2}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => setEditingRole(null)}
                        sx={{
                          borderColor: "error.main",
                          color: "error.main",
                          "&:hover": { backgroundColor: "error.light" },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={savePermissions}
                        sx={{
                          backgroundColor: "primary.main",
                          "&:hover": { backgroundColor: "primary.dark" },
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
