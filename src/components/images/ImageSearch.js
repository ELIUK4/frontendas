import React, { useState, useEffect } from 'react';
import { imageApi, favoriteApi } from '../../services/api';
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
import { Favorite, FavoriteBorder, Comment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ImageDialog from './ImageDialog';

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
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
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

  const handleSearch = () => {
    setLoading(true);
    imageApi.search(query)
      .then(response => {
        if (response.data && response.data.hits) {
          setImages(response.data.hits);
        }
      })
      .catch(error => {
        console.error('Failed to search images:', error);
        setImages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleFavorite = async (imageId, image) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      if (favorites.includes(imageId)) {
        await favoriteApi.removeFromFavorites(imageId);
        setFavorites(favorites.filter(id => id !== imageId));
      } else {
        const imageData = {
          webformatURL: image.webformatURL,
          pageURL: image.pageURL,
          type: 'photo',
          tags: image.tags,
          previewURL: image.previewURL,
          largeImageURL: image.largeImageURL,
          userId: image.user_id?.toString() || '0',
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
        const savedImage = await imageApi.saveExternal(imageData);
        const savedImageId = savedImage.data.id;
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

  return (
    <Box>
      <WelcomeHeader />
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label="Search Images"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={image.webformatURL}
                  alt={image.tags}
                  onClick={() => handleImageClick(image)}
                  style={{ cursor: 'pointer', objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {image.tags}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton 
                    onClick={() => toggleFavorite(image.id, image)}
                    color="primary"
                  >
                    {favorites.includes(image.id) ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
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
          onFavoriteToggle={(image) => toggleFavorite(image.id, image)}
        />
      </Box>
    </Box>
  );
};

export default ImageSearch;
