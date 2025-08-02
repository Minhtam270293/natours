import React, { useEffect, useState } from 'react';
import tourAPI from '../../../api/tourAPI';
import TourList from '../components/TourList';

function AllToursPage() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    async function fetchTours() {
      try {
        const res = await tourAPI.getAll();
        setTours(res.data.data);
      } catch (error) {
        console.error('Failed to fetch tours: ', error);
      }
    }
    fetchTours();
  }, []);

  return <TourList tourList={tours} />;
}

export default AllToursPage;
