import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import AllToursPage from './pages/AllToursPage';
import TourDetailPage from './pages/TourDetailPage';
import Box from '@mui/material/Box';

TourFeature.propTypes = {};

function TourFeature(props) {
  return (
    <>
      <Box pt={4}>
        <Routes>
          <Route index element={<AllToursPage />} />
          <Route path=":tourID" element={<TourDetailPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default TourFeature;
