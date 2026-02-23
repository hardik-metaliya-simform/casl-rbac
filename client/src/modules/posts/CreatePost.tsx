import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container, Stack } from "@mui/material";
import api from "../../services/apiService";
import { useToast } from "../../toast";

export default function CreatePost() {
  const [content, setContent] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const show = useToast();

  useEffect(() => {
    // Ensure proper route matching logic is implemented here
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { title, description } = content;

    if (!title.trim()) {
      show({ message: "Title is required", severity: "error" });
      return;
    }

    if (!description.trim()) {
      show({ message: "Description is required", severity: "error" });
      return;
    }

    try {
      setLoading(true);
      await api.post("/posts", { title, description });
      show({ message: "Post created successfully", severity: "success" });
      navigate("/posts");
    } catch (err) {
      show({
        message: (err as Error)?.message || "Failed to create post",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} fontWeight={600} color="primary.main">
        Create New Post
      </Typography>
      <Stack spacing={3}>
        <TextField
          label="Title"
          name="title"
          value={content.title}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          error={!content.title.trim()}
          helperText={!content.title.trim() ? "Title is required" : ""}
        />
        <TextField
          label="Description"
          name="description"
          value={content.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          error={!content.description.trim()}
          helperText={
            !content.description.trim() ? "Description is required" : ""
          }
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
          {loading ? "Creating..." : "Create Post"}
        </Button>
      </Stack>
    </Container>
  );
}
