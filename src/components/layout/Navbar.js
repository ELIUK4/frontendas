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
      position="static" 
      sx={{ 
        background: 'rgba(211, 47, 47, 0.95)', // Raudona su permatomumu
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
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
            <GalleryIcon sx={{ mr: 1, color: 'white' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                color: 'white',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              Galerija
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <>
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/search')}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  }
                }}
              >
                <SearchIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/favorites')}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  }
                }}
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/history')}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  }
                }}
              >
                <HistoryIcon />
              </IconButton>
              <Typography 
                variant="body1" 
                sx={{ 
                  mx: 2,
                  color: 'white',
                  fontWeight: 500
                }}
              >
                {user.username}
              </Typography>
              <IconButton 
                color="inherit" 
                onClick={handleLogout}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{ 
                  backgroundColor: 'white',
                  color: '#d32f2f',
                  mr: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                startIcon={<RegisterIcon />}
                onClick={() => navigate('/register')}
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { 
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
