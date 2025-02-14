import React, { useState, useEffect } from 'react';
import searchHistoryApi from '../../api/searchHistoryApi';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await searchHistoryApi.getUserSearchHistory();
      console.log('Search history response:', response);
      setHistory(response.data.content || []);
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await searchHistoryApi.clearSearchHistory();
      setHistory([]);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleSearch = (query) => {
    navigate('/', { state: { searchQuery: query } });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Search History
        </Typography>
        
        {history.length > 0 ? (
          <>
            <List>
              {history.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.searchQuery}
                    secondary={`Results: ${item.resultsCount} • ${new Date(item.searchDate).toLocaleString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleSearch(item.searchQuery)}
                      sx={{ mr: 1 }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenDialog(true)}
              sx={{ mt: 2 }}
            >
              Clear History
            </Button>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No search history available
          </Typography>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Clear Search History</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear your entire search history? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleClearHistory} color="error">
            Clear History
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SearchHistory;
