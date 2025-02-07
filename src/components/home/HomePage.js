import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Paper,
  Modal,
  IconButton,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Comment, 
  Close,
  Send,
  BookmarkBorder,
  Bookmark,
  KeyboardArrowDown
} from '@mui/icons-material';
import { imageApi, favoriteApi } from '../../services/api';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [favorites, setFavorites] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchRandomImages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await imageApi.search('professional camera DSLR', {
          perPage: 12,
          imageType: 'photo',
          orientation: 'horizontal',
          category: 'science'
        });

        if (response.data && response.data.hits && response.data.hits.length > 0) {
          setImages(response.data.hits);
          
          response.data.hits.forEach(async (image) => {
            try {
              const isFavorite = await favoriteApi.checkFavorite(image.id);
              setFavorites(prev => ({
                ...prev,
                [image.id]: isFavorite
              }));
            } catch (error) {
              console.error('Failed to check favorite status:', error);
            }
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Failed to load images. Please try again later.',
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load images. Please try again later.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRandomImages();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = (imageId) => {
    if (comment.trim()) {
      const newComment = {
        text: comment,
        user: 'User',
        timestamp: new Date().toISOString()
      };

      setComments(prev => ({
        ...prev,
        [imageId]: [...(prev[imageId] || []), newComment]
      }));
      setComment('');
    }
  };

  const handleLike = (imageId) => {
    setLikes(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  const handleFavorite = async (imageId) => {
    try {
      if (favorites[imageId]) {
        await favoriteApi.removeFavorite(imageId);
      } else {
        await favoriteApi.addFavorite(imageId);
      }
      
      setFavorites(prev => ({
        ...prev,
        [imageId]: !prev[imageId]
      }));

      setSnackbar({
        open: true,
        message: favorites[imageId] ? 'Removed from favorites' : 'Added to favorites',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update favorite:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update favorite. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Landing Page */}
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          display: showGallery ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'url(https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontFamily: "'Permanent Marker', cursive",
              color: '#000000',
              textShadow: '2px 2px 4px rgba(255,255,255,0.3)',
              letterSpacing: '2px',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }
            }}
          >
            Discover the World of Photography
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mb: 4,
              fontFamily: "'Permanent Marker', cursive",
              color: '#000000',
              textShadow: '2px 2px 4px rgba(255,255,255,0.3)',
              letterSpacing: '1px'
            }}
          >
            Every photograph tells a story. What story will you tell?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowGallery(true)}
            sx={{
              color: '#000000',
              fontSize: '1.5rem',
              fontFamily: "'Permanent Marker', cursive",
              textTransform: 'none',
              border: 'none',
              background: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                background: 'none',
              }
            }}
          >
            Start Journey
          </Button>
        </Container>
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 20,
            color: 'white',
            animation: 'bounce 2s infinite'
          }}
          onClick={() => setShowGallery(true)}
        >
          <KeyboardArrowDown sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>

      {/* Gallery Section */}
      {showGallery && (
        <Container maxWidth="xl" sx={{ py: 4 }}>
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
                    sx={{ cursor: 'pointer' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <IconButton onClick={() => handleLike(image.id)}>
                          {likes[image.id] ? <Favorite color="error" /> : <FavoriteBorder />}
                        </IconButton>
                        <IconButton onClick={() => handleImageClick(image)}>
                          <Comment />
                        </IconButton>
                      </Box>
                      <IconButton onClick={() => handleFavorite(image.id)}>
                        {favorites[image.id] ? <Bookmark color="primary" /> : <BookmarkBorder />}
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Image Modal */}
      <Modal
        open={!!selectedImage}
        onClose={handleCloseModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', p: 2 }}>
          {selectedImage && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={handleCloseModal}>
                  <Close />
                </IconButton>
              </Box>
              <img
                src={selectedImage.webformatURL}
                alt={selectedImage.tags}
                style={{ width: '100%', height: 'auto' }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Comments</Typography>
                <List>
                  {(comments[selectedImage.id] || []).map((comment, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>{comment.user[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={comment.text}
                          secondary={new Date(comment.timestamp).toLocaleString()}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={handleCommentChange}
                  />
                  <IconButton onClick={() => handleCommentSubmit(selectedImage.id)}>
                    <Send />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
