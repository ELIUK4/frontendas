import React, { useState, useEffect } from 'react';
import { imageApi, favoriteApi } from '../../services/api';
import {
  Box,
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
import ImageDialog from '../images/ImageDialog';

const Gallery = ({ isAuthenticated }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadRandomImages();
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadRandomImages = () => {
    setLoading(true);
    const categories = ['nature', 'city', 'technology', 'people', 'animals'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    imageApi.search(randomCategory)
      .then(response => {
        if (response.data && response.data.hits) {
          setImages(response.data.hits);
        }
      })
      .catch(error => {
        console.error('Failed to fetch images:', error);
        setImages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Photography – The Magic of a Moment
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Photography is more than just an image. It is a moment frozen in time, an emotion preserved forever. 
          Every photograph tells its own story—sometimes joyful, sometimes melancholic, and sometimes mesmerizing with mystery.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Light and shadows dance like a painter's brushstrokes, colors breathe life, and details reveal the beauty 
          of the world as seen through the heart. A single press of a button can capture a smile, a clear sky, 
          the last rays of a sunset, or eyes that hold an entire universe.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Photography is an art form that allows us to return to the past and relive our most treasured moments. 
          It connects the past, present, and future because what was once fleeting becomes eternal.
        </Typography>
      </Container>
      <Container maxWidth="xl">
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
      </Container>
    </Box>
  );
};

export default Gallery;
