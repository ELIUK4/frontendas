import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { imageApi } from '../../services/api';

const UploadDialog = ({ open, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await imageApi.uploadImage(formData);
      onUploadSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Failed to upload image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Photo</DialogTitle>
      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            mb: 2,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main'
            }
          }}
        >
          <input {...getInputProps()} />
          {preview ? (
            <Box>
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain'
                }}
              />
            </Box>
          ) : (
            <Typography color="text.secondary">
              {isDragActive
                ? 'Drop the photo here...'
                : 'Drag & drop a photo here, or click to select'}
            </Typography>
          )}
        </Box>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          variant="contained"
        >
          {uploading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
