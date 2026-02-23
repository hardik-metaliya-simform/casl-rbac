import { useEffect, useState } from "react";
import api from "../services/apiService";
import { can } from "../services/helperService";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Stack,
  Divider,
  CircularProgress,
  CardActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function Posts() {
  const [posts, setPosts] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreatePost = () => {
    navigate("/posts/create");
  };

  const handleEditPost = (postId: string) => {
    navigate(`/posts/edit/${postId}`);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/posts/${postToDelete}`);
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postToDelete));
    } catch (err: any) {
      console.error("Failed to delete post", err);
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 6, backgroundColor: "#f9f9f9", borderRadius: 2 }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{ backgroundColor: "#ffffff", p: 3, borderRadius: 2, boxShadow: 1 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} color="primary.main">
            Posts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and organize your content
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={can("create", "posts")}
          onClick={handleCreatePost}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Create Post
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress color="primary" />
        </Box>
      ) : posts.length === 0 ? (
        /* Empty State */
        <Box textAlign="center" mt={8}>
          <Typography variant="h6" gutterBottom color="text.primary">
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Start by creating your first post.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={can("create", "posts")}
            onClick={handleCreatePost}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Create Post
          </Button>
        </Box>
      ) : (
        /* Posts Grid */
        <Grid container spacing={3}>
          {posts.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    color="primary.main"
                  >
                    {p.title}
                  </Typography>

                  {p.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.description}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      disabled={can("update", "posts")}
                      onClick={() => handleEditPost(p.id)}
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": { backgroundColor: "primary.light" },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      disabled={can("delete", "posts")}
                      onClick={() => handleDeleteClick(p.id)}
                      sx={{ "&:hover": { backgroundColor: "error.light" } }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
