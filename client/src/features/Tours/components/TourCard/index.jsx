import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

function TourCard({ tour }) {
  const nextDate = tour.startDates?.[0]
    ? new Date(tour.startDates[0]).toLocaleString('en-us', {
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';
  const participants = `${tour.maxGroupSize - tour.remainingSlots} / ${tour.maxGroupSize} people`;
  const stops = tour.locations?.length || 0;

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__picture">
          <div className="card__picture-overlay">&nbsp;</div>
          <img
            className="card__picture-img"
            src={`/img/tours/${tour.imageCover}`}
            alt={tour.name}
          />
        </div>
        <h3 className="heading-tertirary">
          <span>{tour.name}</span>
        </h3>
      </div>

      <div className="card__details">
        <h4 className="card__sub-heading">
          {tour.difficulty} {tour.duration}-day tour
        </h4>
        <p className="card__text">{tour.summary}</p>
        <div className="card__data">
          <span>{tour.startLocation?.description}</span>
        </div>
        <div className="card__data">
          <span>{nextDate}</span>
        </div>
        <div className="card__data">
          <span>{stops} stops</span>
        </div>
        <div className="card__data">
          <span>{participants}</span>
        </div>
      </div>

      <div className="card__footer">
        <p>
          <span className="card__footer-value">${tour.price}</span>{' '}
          <span className="card__footer-text">per person</span>
        </p>
        <p className="card__ratings">
          <span className="card__footer-value">{tour.ratingsAverage}</span>{' '}
          <span className="card__footer-text">
            rating ({tour.ratingsQuantity})
          </span>
        </p>
        <a className="btn btn--green btn--small" href={`/tour/${tour.slug}`}>
          Details
        </a>
      </div>
    </div>
  );
}

TourCard.propTypes = {
  tour: PropTypes.object.isRequired,
};

export default TourCard;
