/* eslint-disable */

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYTEzbWluaHRhbSIsImEiOiJjbWE1NzA4c3IwNHhhMmpzOW1wZ3BvbDBoIn0.07QcDzWcxf9zGOkSEw9HRg';

  var map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/a13minhtam/cma6iesju00e401r4fijn5a0e',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
