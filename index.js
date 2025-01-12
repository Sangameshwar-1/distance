import express from 'express';
import fetch from 'node-fetch'; // Importing node-fetch in ES module style

const app = express();
const port = 3000;

const apiKey = '5b3ce3597851110001cf6248707eb42f8c9c4160961e9baecd37b843';

// Function to get coordinates for a given place
async function getCoordinates(place) {
  const geocodeUrl = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(place)}`;
  const response = await fetch(geocodeUrl);
  if (!response.ok) throw new Error('Failed to fetch coordinates');
  const data = await response.json();
  if (data.features && data.features.length > 0) {
    const [lon, lat] = data.features[0].geometry.coordinates;
    return { lat, lon };
  } else {
    throw new Error(`Unable to find coordinates for ${place}`);
  }
}

// Function to calculate the driving distance between two coordinates
async function calculateDistance(startCoords, endCoords) {
  const directionsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords.lon},${startCoords.lat}&end=${endCoords.lon},${endCoords.lat}`;
  const response = await fetch(directionsUrl);
  if (!response.ok) throw new Error('Failed to calculate distance');
  const data = await response.json();
  if (data.features && data.features[0]) {
    const distance = data.features[0].properties.segments[0].distance / 1000; // Convert from meters to kilometers
    return distance.toFixed(2);
  } else {
    throw new Error('Unable to calculate distance');
  }
}

// API endpoint to calculate the distance between two places
app.get('/calculate-distance', async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).send('Please provide both "start" and "end" place names');
  }

  try {
    const startCoords = await getCoordinates(start);
    const endCoords = await getCoordinates(end);
    
    const distance = await calculateDistance(startCoords, endCoords);
    
    res.json({
      start,
      end,
      distance: `${distance} km`
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
