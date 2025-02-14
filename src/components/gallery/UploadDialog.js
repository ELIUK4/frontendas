import React, { useState, useCallback } from 'react';
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
import { useDropzone } from 'react-dropzone';
import { imageApi } from '../../services/api';

const UploadDialog = ({ open, onClose, onUploadSuccess }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!preview) return;

    try {
      setUploading(true);
      const formData = new FormData();
      const response = await fetch(preview);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      formData.append('file', file);

      await imageApi.uploadImage(formData);
      onUploadSuccess();
      handleClose();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Upload Image</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'action.hover' : 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          ) : (
            <Typography>
              {isDragActive
                ? 'Drop the image here'
                : 'Drag and drop an image here, or click to select'}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleUpload}
          color="primary"
          disabled={!preview || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
