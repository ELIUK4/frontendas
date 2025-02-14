import React, { useState, useEffect } from 'react';
import { imageApi, favoriteApi } from '../../services/api';
import searchHistoryApi from '../../api/searchHistoryApi';
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Container,
} from '@mui/material';
import { Favorite, FavoriteBorder, Comment, CloudUpload, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ImageDialog from './ImageDialog';
import UploadDialog from './UploadDialog';

const WelcomeHeader = () => (
  <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
    <Typography variant="h2" component="h1" gutterBottom>
      Welcome to Photo Gallery
    </Typography>
    <Typography variant="h5" color="text.secondary" paragraph>
      Discover amazing photography from around the world. Browse our collection of high-quality images,
      save your favorites, and join our community of photography enthusiasts.
    </Typography>
  </Container>
);

const ImageSearch = ({ isAuthenticated }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load default images on mount
    handleSearch('camera');

    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      const response = await favoriteApi.getUserFavorites();
      const favoriteIds = response.data.content?.map(fav => fav.image.id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    }
  };

  const handleSearch = async (searchQuery) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm) return;

    setLoading(true);
    try {
      const response = await imageApi.search(searchTerm);
      const searchResults = response.data.hits.map(image => ({
        id: image.id.toString(),
        webformatURL: image.webformatURL,
        largeImageURL: image.largeImageURL,
        previewURL: image.previewURL || image.webformatURL,
        type: 'photo',
        tags: image.tags || '',
        user_id: image.user_id || '0',
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
      }));
      setImages(searchResults);

      // Save search to history if user is authenticated
      if (isAuthenticated && searchTerm !== 'camera') {
        try {
          await searchHistoryApi.saveSearch(searchTerm, response.data.hits.length);
        } catch (error) {
          console.error('Failed to save search to history:', error);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (imageId, image) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      if (favorites.includes(imageId)) {
        setFavorites(favorites.filter(id => id !== imageId));
        await favoriteApi.removeFromFavorites(imageId);
      } else {
        const imageData = {
          webformatURL: image.webformatURL,
          pageURL: image.pageURL || window.location.href,
          type: image.type,
          tags: image.tags,
          previewURL: image.previewURL,
          largeImageURL: image.largeImageURL,
          userId: image.user_id,
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
        
        // Pirma išsaugome nuotrauką mūsų sistemoje
        const savedImage = await imageApi.saveExternal(imageData);
        const savedImageId = savedImage.data.id;
        
        // Tada pridedame į favoritus
        await favoriteApi.addToFavorites(savedImageId);
        setFavorites([...favorites, savedImageId]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedImage(null);
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Remove image from state
      setImages(images.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <Box>
      <WelcomeHeader />

      <Container maxWidth="lg">
        <Box sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Search Images"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSearch()}
                  disabled={loading}
                  sx={{
                    height: '56px',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    setUploadDialogOpen(true);
                  }}
                  startIcon={<CloudUpload />}
                  sx={{
                    height: '56px',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Upload
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {images.map((image) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image.webformatURL}
                    alt={image.tags}
                    sx={{ cursor: 'pointer', objectFit: 'cover' }}
                    onClick={() => handleImageClick(image)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {image.tags}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', padding: '8px 16px' }}>
                    <Box>
                      <IconButton 
                        onClick={() => toggleFavorite(image.id, image)}
                        color="primary"
                      >
                        {favorites.includes(image.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      {image.user_id === localStorage.getItem('username') && (
                        <IconButton 
                          onClick={() => handleDelete(image.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                    <IconButton
                      onClick={() => handleImageClick(image)}
                      color="primary"
                    >
                      <Comment />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <ImageDialog
            open={dialogOpen}
            onClose={handleDialogClose}
            image={selectedImage}
            isAuthenticated={isAuthenticated}
            isFavorite={selectedImage ? favorites.includes(selectedImage.id) : false}
            onFavoriteToggle={() => selectedImage && toggleFavorite(selectedImage.id, selectedImage)}
          />

          <UploadDialog
            open={uploadDialogOpen}
            onClose={() => setUploadDialogOpen(false)}
            onUploadSuccess={() => {
              setUploadDialogOpen(false);
              handleSearch(query);
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ImageSearch;
