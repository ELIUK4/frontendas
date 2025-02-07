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
  Bookmark
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

        console.log('Image search response:', response);
        if (response.data && response.data.hits && response.data.hits.length > 0) {
          setImages(response.data.hits);
          
          // Check favorite status for each image
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
          console.error('No images found in response:', response);
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

  const handleLike = (imageId) => {
    setLikes(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  const handleFavorite = async (image) => {
    try {
      if (favorites[image.id]) {
        await favoriteApi.removeFromFavorites(image.id);
        setSnackbar({
          open: true,
          message: 'Removed from favorites',
          severity: 'success'
        });
      } else {
        await favoriteApi.addToFavorites(image.id, {
          params: {
            url: image.webformatURL,
            tags: image.tags,
            user: image.user
          }
        });
        setSnackbar({
          open: true,
          message: 'Added to favorites',
          severity: 'success'
        });
      }
      setFavorites(prev => ({
        ...prev,
        [image.id]: !prev[image.id]
      }));
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Please login to add favorites',
        severity: 'error'
      });
      console.error('Failed to update favorite:', error);
    }
  };

  const handleCommentSubmit = (imageId) => {
    if (!comment.trim()) return;
    
    setComments(prev => ({
      ...prev,
      [imageId]: [...(prev[imageId] || []), {
        text: comment,
        author: 'User',
        timestamp: new Date().toISOString()
      }]
    }));
    setComment('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            p: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'black',
              fontWeight: 900,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              mb: 3
            }}
          >
            Welcome to Galerija
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'black',
              fontWeight: 700,
              mb: 4
            }}
          >
            Discover and share beautiful moments through photography
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {!loading && images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transform: 'perspective(1000px)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(5deg)',
                    '& .image-overlay': {
                      opacity: 1
                    }
                  },
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}
              >
                <CardMedia
                  component="img"
                  height="260"
                  image={image.webformatURL}
                  alt={image.tags}
                  sx={{ 
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleImageClick(image)}
                />
                <Box
                  className="image-overlay"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    p: 2,
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      {image.tags}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(image.id);
                        }}
                        sx={{ color: 'white' }}
                      >
                        {likes[image.id] ? <Favorite color="error" /> : <FavoriteBorder />}
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(image);
                        }}
                        sx={{ color: 'white' }}
                      >
                        {favorites[image.id] ? <Bookmark color="primary" /> : <BookmarkBorder />}
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(image);
                        }}
                        sx={{ color: 'white' }}
                      >
                        <Comment />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    by {image.user}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Modal
          open={!!selectedImage}
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Box
            sx={{
              position: 'relative',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 2,
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                bgcolor: 'rgba(0,0,0,0.4)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.6)'
                }
              }}
              onClick={handleCloseModal}
            >
              <Close />
            </IconButton>
            
            {selectedImage && (
              <>
                <img
                  src={selectedImage.largeImageURL || selectedImage.webformatURL}
                  alt={selectedImage.tags}
                  style={{
                    width: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain'
                  }}
                />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Comments
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit(selectedImage.id);
                        }
                      }}
                    />
                    <IconButton 
                      color="primary"
                      onClick={() => handleCommentSubmit(selectedImage.id)}
                    >
                      <Send />
                    </IconButton>
                  </Box>

                  <List>
                    {comments[selectedImage.id]?.map((comment, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>{comment.author[0]}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={comment.author}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {comment.text}
                                </Typography>
                                {" — " + new Date(comment.timestamp).toLocaleString()}
                              </>
                            }
                          />
                        </ListItem>
                        {index < (comments[selectedImage.id].length - 1) && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </>
            )}
          </Box>
        </Modal>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default HomePage;
