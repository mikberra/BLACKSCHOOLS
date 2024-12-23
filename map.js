mapboxgl.accessToken = 'pk.eyJ1IjoibWlrYmVycmEiLCJhIjoiY20xODh2MHdwMTIwdDJxcHNhazBoZTE3NCJ9.KQAl5jVzZBXZUvvLoD4x_Q';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mikberra/cm1gpvzcc00y601nw1c3iaao8',
  center: [-73.9442, 40.6982], // Starting position [lng, lat]
  zoom: 11
});


// Added part
map.on('load', () => {
  // Step 1: Add GeoJSON data source 
  map.addSource('mongoLayer', {
      type: 'geojson',
      data: 'https://blacksch-fe9aed6090ad.herokuapp.com/api/geojson' // Replace with your API endpoint
  });

  // Step 2: Add a data layer (You’ve already finished this in Lab7)
  map.addLayer({
      id: 'mongoLayer',
      type: 'circle', // Circle marker
      source: 'mongoLayer',
      paint: {
          'circle-radius': 5, // Radius of the circle
          'circle-color': '#000' // Circle color
      }
  });

  map.getSource('mongoLayer').on('data', (e) => {
    if (e.isSourceLoaded) {
      const geojson = map.getSource('mongoLayer')._data; // Access the GeoJSON data
      const bounds = new mapboxgl.LngLatBounds();

      geojson.features.forEach(feature => {
        bounds.extend(feature.geometry.coordinates); // Extend bounds for each point
      });

      map.fitBounds(bounds, {
        padding: 1, // Optional: Adds padding around the bounds
        maxZoom: 14 // Optional: Limits the maximum zoom level
      });
    }
  });

  // Step 3: Create a pop-up instance
  const popup = new mapboxgl.Popup({
      closeButton: false, // Disable close button
      closeOnClick: false // Keep pop-up open when clicking elsewhere
  });

  // Step 4: Add mouseenter event to show the pop-up
  map.on('mouseenter', 'mongoLayer', (e) => {
      // Change the cursor to a pointer to indicate interactivity
      map.getCanvas().style.cursor = 'pointer';

      // Extract the coordinates and properties of the hovered point
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

      // Set the content of the pop-up
      popup.setLngLat(coordinates)
          .setHTML(`
              <h3>${properties.Name || 'Unknown Name'}</h3>
              <p>${properties.Address || 'No address'}</p>
          `)
          .addTo(map);
  });

  // Step 5: Add mouseleave event to remove the pop-up
  map.on('mouseleave', 'mongoLayer', () => {
      // Reset the cursor style
      map.getCanvas().style.cursor = '';
        // Remove the pop-up
        popup.remove();
    });

    // Add click handler for the schools layer
    map.on('click', 'mongoLayer', (e) => {
        if (e.features.length > 0) {
            const schoolId = e.features[0].properties._id;
            console.log('Clicked school ID:', schoolId); // Debug log
            
            if (schoolId) {
                // Navigate to CS page with the school ID
                window.location.href = `/CS/${schoolId}`;
            }
        }
    });

    // Optional: Change cursor to pointer when hovering over schools
    map.on('mouseenter', 'mongoLayer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'mongoLayer', () => {
        map.getCanvas().style.cursor = '';
    });
});

