import axios from './axiosConfig';

const searchHistoryApi = {
    saveSearch: async (searchQuery, resultsCount) => {
        try {
            const response = await axios.post('/api/search-history/save', {
                searchQuery,
                resultsCount
            });
            return response.data;
        } catch (error) {
            console.error('Failed to save search:', error);
            throw error;
        }
    },

    getUserSearchHistory: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`/api/search-history/user?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error('Failed to get search history:', error);
            throw error;
        }
    },

    clearSearchHistory: async () => {
        try {
            const response = await axios.delete('/api/search-history/clear');
            return response.data;
        } catch (error) {
            console.error('Failed to clear search history:', error);
            throw error;
        }
    }
};

export default searchHistoryApi;
