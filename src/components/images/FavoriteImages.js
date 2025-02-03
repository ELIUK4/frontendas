import React, { useState, useEffect } from 'react';
import { imageApi } from '../../services/api';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';

const FavoriteImages = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await imageApi.getFavorites();
      setFavorites(response.data.content);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (imageId) => {
    try {
      await imageApi.removeFromFavorites(imageId);
      setFavorites(favorites.filter(fav => fav.image.id !== imageId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Favorite Images
      </Typography>

      {favorites.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No favorite images yet. Start by adding some from the search page!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((favorite) => (
            <Grid item key={favorite.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={favorite.image.webformatURL}
                  alt={favorite.image.tags}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {favorite.image.tags}
                  </Typography>
                  <Typography variant="caption" display="block">
                    By {favorite.image.user}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton
                    onClick={() => removeFavorite(favorite.image.id)}
                    color="primary"
                  >
                    <Favorite />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {favorite.image.likes} likes
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoriteImages;
