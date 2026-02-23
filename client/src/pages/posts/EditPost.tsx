import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Stack } from "@mui/material";
import api from "../../services/apiService";

export default function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost({ title: res.data.title, description: res.data.description });
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!post.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!post.description.trim()) {
      alert("Description is required");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/posts/${id}`, post);
      alert("Post updated successfully");
      navigate("/posts");
    } catch (err) {
      alert("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3} fontWeight={600} color="primary.main">
        Edit Post
      </Typography>
      <Stack spacing={3}>
        <TextField
          label="Title"
          name="title"
          value={post.title}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          error={!post.title.trim()}
          helperText={!post.title.trim() ? "Title is required" : ""}
        />
        <TextField
          label="Description"
          name="description"
          value={post.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          error={!post.description.trim()}
          helperText={!post.description.trim() ? "Description is required" : ""}
        />
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          {loading ? "Updating..." : "Update Post"}
        </Button>
      </Stack>
    </Container>
  );
}
