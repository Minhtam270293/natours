import React from 'react';
import PropTypes from 'prop-types';
import TourCard from '../TourCard';

TourList.propTypes = {
  tourList: PropTypes.array,
};

TourList.defaultProps = {
  tourList: [],
};

function TourList(props) {
  const { tourList } = props;

  return (
    <div className="tour-list">
      {tourList.map((tour) => (
        <div key={tour._id}>
          <TourCard tour={tour} />
        </div>
      ))}
    </div>
  );
}

export default TourList;
