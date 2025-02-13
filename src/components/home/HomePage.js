import React from 'react';
import Gallery from '../gallery/Gallery';

const HomePage = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return <Gallery isAuthenticated={isAuthenticated} />;
};

export default HomePage;
