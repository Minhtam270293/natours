import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import tourAPI from '../../../../api/tourAPI';
import TourList from '../../components/TourList';
import TourSort from '../../components/TourSort';
import { Box, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const LeftCol = styled(Grid)({
  width: 250,
});

const RightCol = styled(Grid)({
  flex: '1 1 auto',
});

function AllToursPage() {
  const [tours, setTours] = useState([]);
  const [sortParam, setSortParam] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const location = useLocation();
  const navigate = useNavigate();
  const requiredFields =
    'name,imageCover,difficulty,duration,summary,startLocation,startDates,locations,maxGroupSize,remainingSlots, price, locations, ratingsQuantity, ratingsAverage, slug';

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    async function fetchTours() {
      try {
        const res = await tourAPI.getAll({ ...params, fields: requiredFields });
        console.log('API response:', res);
        if (res) {
          setTours(res.data.data.data);
        } else {
          console.error('Unexpected API response:', res);
        }
      } catch (error) {
        console.error('Failed to fetch tours: ', error);
      }
    }
    fetchTours();
  }, [location.search]);

  const handleSortChange = ({ sortParam, sortOrder }) => {
    setSortParam(sortParam);
    setSortOrder(sortOrder);
    const sortValue = sortOrder === 'asc' ? sortParam : `-${sortParam}`;
    const params = new URLSearchParams(location.search);
    params.set('sort', sortValue);
    navigate(`?${params.toString()}`);
  };

  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <LeftCol item>
            <Paper elevation={2} sx={{ p: 2 }}>
              <TourSort
                sortParam={sortParam}
                sortOrder={sortOrder}
                onChange={handleSortChange}
              />
            </Paper>
          </LeftCol>
          <RightCol item>
            <Paper elevation={2} sx={{ p: 2 }}>
              <TourList tourList={tours} />
            </Paper>
          </RightCol>
        </Grid>
      </Container>
    </Box>
  );
}

export default AllToursPage;
