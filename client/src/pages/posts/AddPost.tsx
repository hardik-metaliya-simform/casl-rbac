import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container, Stack } from "@mui/material";
import api from "../../services/apiService";
import { useToast } from "../../toast";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const show = useToast();

  const handleSubmit = async () => {
    if (!title.trim()) {
      show({ message: "Title is required", severity: "error" });
      return;
    }

    try {
      setLoading(true);
      await api.post("/posts", { title, content });
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          variant="outlined"
          error={!title.trim()}
          helperText={!title.trim() ? "Title is required" : ""}
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
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
