import React from 'react';
import PropTypes from 'prop-types';

function TourCard({ tour }) {
  return <div className="card">{tour.name}</div>;
}

TourCard.propTypes = {
  tour: PropTypes.object.isRequired,
};

export default TourCard;
