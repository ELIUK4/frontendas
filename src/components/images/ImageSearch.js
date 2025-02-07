import React, { useState, useEffect } from 'react';
import { imageApi, categoryApi, favoriteApi } from '../../services/api';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import ImageDialog from './ImageDialog';

const ImageSearch = ({ isAuthenticated }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadCategories();
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data.map(cat => cat.name));
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await favoriteApi.getUserFavorites();
      setFavorites(response.data.content.map(fav => fav.image.id));
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await imageApi.search(query, {
        category: selectedCategory,
        per_page: 20,
      });
      setImages(response.data.hits);
    } catch (error) {
      console.error('Failed to search images:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (imageId, image) => {
    if (!isAuthenticated) {
      // You might want to show a login prompt here
      return;
    }
    try {
      if (favorites.includes(imageId)) {
        await favoriteApi.removeFromFavorites(imageId);
        setFavorites(favorites.filter(id => id !== imageId));
      } else {
        await favoriteApi.addToFavorites(imageId, {
          params: {
            url: image.webformatURL,
            tags: image.tags,
            user: image.user
          }
        });
        setFavorites([...favorites, imageId]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  const handleLike = async (imageId) => {
    try {
      await imageApi.likeImage(imageId);
      setImages(images.map(image => image.id === imageId ? { ...image, likes: image.likes + 1 } : image));
    } catch (error) {
      console.error('Failed to like image:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Images"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{
                backgroundColor: '#000000',
                '&:hover': {
                  backgroundColor: '#333333',
                },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={image.webformatURL}
                alt={image.tags}
                onClick={() => handleImageClick(image)}
                sx={{ cursor: 'pointer', objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {image.tags}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton 
                  onClick={() => toggleFavorite(image.id, image)}
                  sx={{
                    color: favorites.includes(image.id) ? '#ff3d3d' : 'inherit',
                    '&:hover': {
                      color: favorites.includes(image.id) ? '#ff1111' : '#ff3d3d'
                    }
                  }}
                >
                  {favorites.includes(image.id) ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                <IconButton onClick={() => handleLike(image.id)}>
                  <Typography variant="body2" color="text.secondary">
                    {image.likes} likes
                  </Typography>
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ImageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        image={selectedImage}
      />
    </Container>
  );
};

export default ImageSearch;
