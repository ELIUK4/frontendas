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
  const [showFullSize, setShowFullSize] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !isAuthenticated) return;

    try {
      // First save the image to get its database ID
      const imageData = {
        webformatURL: image.webformatURL,
        previewURL: image.previewURL || image.webformatURL,
        pageURL: image.pageURL,
        tags: image.tags,
        type: image.type || 'photo',
        userId: image.user_id?.toString() || '0',
        largeImageURL: image.largeImageURL,
        fullHDURL: image.fullHDURL,
        imageURL: image.imageURL,
        imageWidth: image.imageWidth,
        imageHeight: image.imageHeight,
        imageSize: image.imageSize,
        views: image.views,
        downloads: image.downloads,
        likes: image.likes,
        webformatWidth: image.webformatWidth,
        webformatHeight: image.webformatHeight,
        previewWidth: image.previewWidth,
        previewHeight: image.previewHeight
      };

      const imageResponse = await imageApi.saveExternal(imageData);

      // Get the saved image ID from the response
      const savedImageId = imageResponse.data.id;

      // Now add the comment using the saved image ID
      const commentResponse = await imageApi.addComment(savedImageId, comment);
      setComments([...comments, commentResponse.data]);
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
          {/* Full size image dialog */}
          <Dialog
            open={showFullSize}
            onClose={() => setShowFullSize(false)}
            maxWidth={false}
            fullWidth
            PaperProps={{
              sx: {
                width: '95vw',
                height: '95vh',
                maxWidth: 'none',
                m: 0
              }
            }}
          >
            <DialogContent sx={{ p: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={image.fullscreenImageURL || image.largeImageURL || image.webformatURL}
                alt={image.tags}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
                onClick={() => setShowFullSize(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Thumbnail image */}
          <img
            src={image.webformatURL}
            alt={image.tags}
            style={{ 
              width: '100%', 
              maxHeight: '70vh', 
              objectFit: 'contain',
              cursor: 'pointer' 
            }}
            onClick={() => setShowFullSize(true)}
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
