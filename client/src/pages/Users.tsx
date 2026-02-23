import { useEffect, useState } from "react";
import api from "../services/apiService";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  ListItemText,
  Checkbox,
  OutlinedInput,
  Card,
  CardContent,
} from "@mui/material";
import { useToast } from "../toast";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    roles: [] as string[],
  });
  const [assigning, setAssigning] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const show = useToast();

  const load = async () => {
    try {
      const [u] = await Promise.all([api.get("/users")]);
      setUsers(u.data);
      setRoles(u.data);
    } catch (err: any) {
      show({ message: err?.message || "Failed to load", severity: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createUser = async () => {
    try {
      await api.post("/users", {
        username: newUser.username,
        password: newUser.password,
        roles: newUser.roles,
      });
      show({ message: "User created", severity: "success" });
      setNewUser({ username: "", password: "", roles: [] });
      load();
    } catch (err: any) {
      show({
        message: err?.response?.data?.message || err.message || "Create failed",
        severity: "error",
      });
    }
  };

  const startAssign = (userId: string, currentRoles: any[]) => {
    setAssigning(userId);
    setSelectedRoles(currentRoles.map((r) => r.id));
  };

  const saveAssign = async () => {
    if (!assigning) return;
    try {
      await api.put(`/users/${assigning}/roles`, { roleIds: selectedRoles });
      show({ message: "Roles assigned", severity: "success" });
      setAssigning(null);
      load();
    } catch (err: any) {
      show({
        message: err?.response?.data?.message || err.message || "Assign failed",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", p: 3, borderRadius: 2 }}>
      <Typography variant="h4" mb={3} color="primary.main" fontWeight={600}>
        Users Management
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                Create New User
              </Typography>
              <Box mt={2} display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  type="password"
                  fullWidth
                  variant="outlined"
                />
                <FormControl fullWidth>
                  <InputLabel id="roles-label">Assign Roles</InputLabel>
                  <Select
                    labelId="roles-label"
                    multiple
                    value={newUser.roles}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        roles: e.target.value as string[],
                      })
                    }
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
                        <Checkbox checked={newUser.roles.indexOf(r.id) > -1} />
                        <ListItemText primary={r.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={createUser}
                  sx={{
                    backgroundColor: "primary.main",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  Create User
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {users.map((u) => (
          <Grid item xs={12} md={6} key={u.id}>
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
                    {u.username}
                  </Typography>
                  <Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => startAssign(u.id, u.roles)}
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": { backgroundColor: "primary.light" },
                      }}
                    >
                      Manage Roles
                    </Button>
                  </Box>
                </Box>
                <Box mt={2}>
                  {(u.roles || []).map((r: any) => (
                    <Chip
                      key={r.id}
                      label={r.name}
                      sx={{
                        mr: 1,
                        backgroundColor: "primary.light",
                        color: "white",
                      }}
                    />
                  ))}
                </Box>
                {assigning === u.id && (
                  <Box mt={3}>
                    <FormControl fullWidth>
                      <InputLabel id="assign-roles-label">Roles</InputLabel>
                      <Select
                        labelId="assign-roles-label"
                        multiple
                        value={selectedRoles}
                        onChange={(e) =>
                          setSelectedRoles(e.target.value as string[])
                        }
                        input={<OutlinedInput label="Roles" />}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {(selected as string[]).map((id) => {
                              const r = roles.find((x) => x.id === id);
                              return (
                                <Chip
                                  key={id}
                                  label={r?.name || id}
                                  sx={{
                                    backgroundColor: "primary.light",
                                    color: "white",
                                  }}
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {roles.map((r) => (
                          <MenuItem key={r.id} value={r.id}>
                            <Checkbox
                              checked={selectedRoles.indexOf(r.id) > -1}
                            />
                            <ListItemText primary={r.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box
                      mt={2}
                      display="flex"
                      justifyContent="flex-end"
                      gap={2}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => setAssigning(null)}
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
                        onClick={saveAssign}
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
