import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const tomtomApiKey = process.env.TOMTOM_API_KEY;

// Calculate Route (Distance, Time, and Geometry) between two coordinates
export const calculateRoute = async (startLng, startLat, endLng, endLat) => {
  try {
    // If the user hasn't set a real API key, return a mocked response to prevent the app from crashing
    if (!tomtomApiKey || tomtomApiKey === 'your_tomtom_api_key') {
      console.log('Using mock routing data because no valid TomTom API key was provided.');
      
      // Calculate straight-line distance using Haversine formula
      const R = 6371e3; // metres
      const φ1 = parseFloat(startLat) * Math.PI/180;
      const φ2 = parseFloat(endLat) * Math.PI/180;
      const Δφ = (parseFloat(endLat)-parseFloat(startLat)) * Math.PI/180;
      const Δλ = (parseFloat(endLng)-parseFloat(startLng)) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distanceInMeters = R * c;

      // Mock travel time (assuming 40km/h average speed in city -> ~ 11.1 m/s)
      const travelTimeInSeconds = Math.round(distanceInMeters / 11.1);

      return {
        success: true,
        distanceInMeters: Math.round(distanceInMeters),
        travelTimeInSeconds: travelTimeInSeconds,
        trafficDelayInSeconds: 0,
        routeDetails: {
          legs: [{
            points: [
              { latitude: parseFloat(startLat), longitude: parseFloat(startLng) },
              { latitude: parseFloat(endLat), longitude: parseFloat(endLng) }
            ]
          }]
        }
      };
    }

    // Real TomTom API logic
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${startLat},${startLng}:${endLat},${endLng}/json`;
    
    const response = await axios.get(url, {
      params: {
        key: tomtomApiKey,
      }
    });

    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const summary = response.data.routes[0].summary;
      return {
        success: true,
        distanceInMeters: summary.lengthInMeters,
        travelTimeInSeconds: summary.travelTimeInSeconds,
        trafficDelayInSeconds: summary.trafficDelayInSeconds,
        // The raw route data is returned so the frontend map can draw the path
        routeDetails: response.data.routes[0]
      };
    } else {
      return { success: false, message: 'No route found' };
    }
  } catch (error) {
    console.error('TomTom Routing API Error:', error.response?.data || error.message);
    throw new Error('Failed to calculate route from TomTom API. Please verify your API Key.');
  }
};
