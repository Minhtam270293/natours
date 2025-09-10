import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tourAPI from '../../../../api/tourAPI';
import TourCard from '../../components/TourCard';

function TourDetailPage() {
  const [tour, setTour] = useState();
  const { tourID } = useParams();

  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await tourAPI.get(tourID);
        // Adjust this if your API response structure is different
        if (res) {
          setTour(res.data.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch tour:', err);
      }
    }
    fetchTour();
  }, [tourID]);

  if (!tour) return <div>...Loading</div>;
  return <TourCard tour={tour} />;
}

export default TourDetailPage;
