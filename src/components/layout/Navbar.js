import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme,
  Container,
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  PhotoLibrary as GalleryIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <GalleryIcon sx={{ mr: 1, color: '#000000' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                color: '#000000',
                fontWeight: 600,
                letterSpacing: '0.5px',
                fontFamily: "'Permanent Marker', cursive",
              }}
            >
              Gallery
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <>
              <IconButton 
                onClick={() => navigate('/search')}
                sx={{ 
                  color: '#000000',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)' 
                  }
                }}
              >
                <SearchIcon />
              </IconButton>
              <IconButton 
                onClick={() => navigate('/favorites')}
                sx={{ 
                  color: '#000000',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)' 
                  }
                }}
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton 
                onClick={() => navigate('/history')}
                sx={{ 
                  color: '#000000',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)' 
                  }
                }}
              >
                <HistoryIcon />
              </IconButton>
              <IconButton
                onClick={handleLogout}
                sx={{ 
                  color: '#000000',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)' 
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  color: '#000000',
                  textTransform: 'none',
                  fontFamily: "'Permanent Marker', cursive",
                  fontSize: '1rem',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)' 
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                startIcon={<RegisterIcon />}
                onClick={() => navigate('/register')}
                sx={{
                  color: '#000000',
                  textTransform: 'none',
                  fontFamily: "'Permanent Marker', cursive",
                  fontSize: '1rem',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)' 
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
