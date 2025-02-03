import React, { useState, useEffect } from 'react';
import { searchHistoryApi } from '../../services/api';
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
      const response = await searchHistoryApi.getHistory();
      setHistory(response.data.content);
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await searchHistoryApi.clearHistory();
      setHistory([]);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleSearch = (query, category) => {
    navigate('/search', { state: { query, category } });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search History
        </Typography>

        {history.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 2 }}
          >
            Clear History
          </Button>
        )}

        {history.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No search history yet. Start searching for images!
          </Typography>
        ) : (
          <List>
            {history.map((item) => (
              <ListItem
                key={item.id}
                divider
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={item.query}
                  secondary={`${new Date(item.timestamp).toLocaleString()} - Category: ${
                    item.category || 'All'
                  }`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleSearch(item.query, item.category)}
                    sx={{ mr: 1 }}
                  >
                    <SearchIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

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
      </Paper>
    </Container>
  );
};

export default SearchHistory;
