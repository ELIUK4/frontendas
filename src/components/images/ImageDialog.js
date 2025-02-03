import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import { Close, Send, Favorite, FavoriteBorder } from '@mui/icons-material';
import { imageApi } from '../../services/api';

const ImageDialog = ({ open, onClose, image, isAuthenticated, isFavorite, onFavoriteToggle }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(image?.comments || []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !isAuthenticated) return;

    try {
      const response = await imageApi.addComment(image.id, comment);
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (!image) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Image Details</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <img
            src={image.largeImageURL || image.webformatURL}
            alt={image.tags}
            style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => onFavoriteToggle(image.id)}
              color={isFavorite ? 'primary' : 'default'}
              disabled={!isAuthenticated}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography>{image.likes} likes</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Tags: {image.tags}
          </Typography>
          <Typography variant="caption">
            By {image.user}
          </Typography>

          <Divider />

          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>{comment.user.username[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.user.username}
                  secondary={comment.content}
                />
              </ListItem>
            ))}
          </List>

          {isAuthenticated && (
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button type="submit" variant="contained" endIcon={<Send />}>
                Post
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
