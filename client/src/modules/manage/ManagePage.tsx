import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/apiService";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useToast } from "../../toast";

export default function ManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const show = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/data"); // Replace with actual endpoint
      setData(res.data);
    } catch (err) {
      show({ message: "Failed to fetch data", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/data/${id}`); // Replace with actual endpoint
      show({ message: "Deleted successfully", severity: "success" });
      fetchData();
    } catch (err) {
      show({ message: "Failed to delete", severity: "error" });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`); // Replace with actual route
  };

  const handleCreate = () => {
    navigate("/create"); // Replace with actual route
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} fontWeight={600} color="primary.main">
        Manage Data
      </Typography>
      <Button
        variant="contained"
        onClick={handleCreate}
        sx={{
          mb: 2,
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "primary.dark" },
        }}
      >
        Create New
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(item.id)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
