// ADD YOUR MAPBOX ACCESS TOKEN
mapboxgl.accessToken = "pk.eyJ1IjoibWlrYmVycmEiLCJhIjoiY20xODh2MHdwMTIwdDJxcHNhazBoZTE3NCJ9.KQAl5jVzZBXZUvvLoD4x_Q"; //YOUR KEY HERE


// CREATE A NEW OBJECT CALLED MAP
const map = new mapboxgl.Map({
  container: "map", // container ID for the map object (this points to the HTML element)
  style: "mapbox://styles/mikberra/cm1gpvzcc00y601nw1c3iaao8", //YOUR STYLE URL
  center: [-73.9442, 40.6482], // starting position [lng, lat] (google brooklyn)
  zoom: 11, // starting zoom (adjust it as you wish)
  projection: "globe", // display the map as a 3D globe
});
