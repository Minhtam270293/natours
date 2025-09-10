import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from '@mui/material';

function TourSort({ sortParam, sortOrder, onChange }) {
  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="sort-param-label">Sort by</InputLabel>
        <Select
          labelId="sort-param-label"
          value={sortParam}
          label="Sort by"
          onChange={(e) => onChange({ sortParam: e.target.value, sortOrder })}
        >
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="ratingsAverage">Rating</MenuItem>
          <MenuItem value="startDates">Start Date</MenuItem>
          <MenuItem value="duration">Duration</MenuItem>
        </Select>
      </FormControl>
      <RadioGroup
        row
        value={sortOrder}
        onChange={(e) => onChange({ sortParam, sortOrder: e.target.value })}
      >
        <FormControlLabel value="asc" control={<Radio />} label="Ascending" />
        <FormControlLabel value="desc" control={<Radio />} label="Descending" />
      </RadioGroup>
    </Box>
  );
}

export default TourSort;
