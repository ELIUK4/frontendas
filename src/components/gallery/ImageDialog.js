import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const ImageDialog = ({ open, onClose, image }) => {
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
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <img
            src={image.largeImageURL || image.webformatURL}
            alt={image.tags}
            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
          />
          <Typography variant="body1">Tags: {image.tags}</Typography>
          <Box display="flex" gap={2}>
            <Typography variant="body2">Likes: {image.likes}</Typography>
            <Typography variant="body2">Views: {image.views}</Typography>
            <Typography variant="body2">Downloads: {image.downloads}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
