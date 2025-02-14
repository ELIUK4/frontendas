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
  Button,
} from '@mui/material';
import { Favorite, FavoriteBorder, Comment, CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ImageDialog from './ImageDialog';
import UploadDialog from './UploadDialog';

const Gallery = ({ isAuthenticated }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadUserImages();
      loadFavorites();
    } else {
      loadRandomImages();
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

  const loadUserImages = async () => {
    setLoading(true);
    try {
      const response = await imageApi.getUserImages();
      if (response.data) {
        setImages(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
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
        // Jei nuotrauka jau turi ID, tai reiškia kad ji jau išsaugota
        if (imageId) {
          await favoriteApi.addToFavorites(imageId);
          setFavorites([...favorites, imageId]);
        } else {
          // Jei nuotrauka neturi ID, pirma ją išsaugome
          const imageData = {
            webformatURL: image.webformatURL || image.largeImageURL,  // Naudojame largeImageURL kaip atsarginį variantą
            pageURL: image.pageURL || '',
            type: image.type || 'photo',
            tags: image.tags || '',
            previewURL: image.previewURL || image.webformatURL || image.largeImageURL,
            largeImageURL: image.largeImageURL || image.webformatURL,
            userId: image.user_id?.toString() || '0',
            fullHDURL: image.fullHDURL || '',
            imageURL: image.imageURL || '',
            imageWidth: image.imageWidth || 0,
            imageHeight: image.imageHeight || 0,
            imageSize: image.imageSize || 0,
            views: image.views || 0,
            downloads: image.downloads || 0,
            likes: image.likes || 0,
            webformatWidth: image.webformatWidth || 0,
            webformatHeight: image.webformatHeight || 0,
            previewWidth: image.previewWidth || 0,
            previewHeight: image.previewHeight || 0
          };
          const savedImage = await imageApi.saveExternal(imageData);
          const savedImageId = savedImage.data.id;
          await favoriteApi.addToFavorites(savedImageId);
          setFavorites([...favorites, savedImageId]);
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleImageClick = (image) => {
    console.log('Original image:', image);
    // Jei tai yra Pixabay nuotrauka
    if (image.webformatURL || image.largeImageURL) {
      const pixabayImage = {
        ...image,
        webformatURL: image.webformatURL,
        largeImageURL: image.largeImageURL,
        previewURL: image.previewURL || image.webformatURL,
        type: 'photo',
        tags: image.tags || '',
        user_id: image.user_id || '0'
      };
      console.log('Setting Pixabay image:', pixabayImage);
      setSelectedImage(pixabayImage);
    } else {
      // Jei tai yra įkelta nuotrauka
      const uploadedImage = {
        ...image,
        webformatURL: `/uploads/${image.fileName}`,
        largeImageURL: `/uploads/${image.fileName}`,
        previewURL: `/uploads/${image.fileName}`,
        type: 'photo',
        tags: image.tags || '',
        user_id: '0'
      };
      console.log('Setting uploaded image:', uploadedImage);
      setSelectedImage(uploadedImage);
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedImage(null);
  };

  const handleUploadSuccess = () => {
    loadUserImages();
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: 800, 
          mx: 'auto', 
          p: 3,
          background: 'linear-gradient(45deg, rgba(26, 26, 26, 0.95) 0%, rgba(51, 51, 51, 0.95) 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          color: 'white'
        }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontFamily: "'Permanent Marker', cursive", color: 'white' }}>
            Photography – The Magic of a Moment
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Photography is more than just an image. It is a moment frozen in time, an emotion preserved forever. Every photograph tells its own story—sometimes joyful, sometimes melancholic, and sometimes mesmerizing with mystery.
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Light and shadows dance like a painter's brushstrokes, colors breathe life, and details reveal the beauty of the world as seen through the heart. A single press of a button can capture a smile, a clear sky, the last rays of a sunset, or eyes that hold an entire universe.
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Photography is an art form that allows us to return to the past and relive our most treasured moments. It connects the past, present, and future because what we capture today becomes tomorrow's memory.
          </Typography>
        </Box>
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
          onClose={() => {
            setDialogOpen(false);
            if (isAuthenticated) {
              loadFavorites(); // Atnaujinti favorites būseną po dialogo uždarymo
            }
          }}
          image={selectedImage}
          isAuthenticated={isAuthenticated}
          isFavorite={selectedImage ? favorites.includes(selectedImage.id) : false}
          onFavoriteToggle={toggleFavorite}
        />

        <UploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </Container>
    </Box>
  );
};

export default Gallery;
