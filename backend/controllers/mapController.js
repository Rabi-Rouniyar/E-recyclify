import { calculateRoute } from '../utils/tomtomService.js';

// @desc    Get routing details between user and recycler
// @route   GET /api/maps/route
// @access  Private
export const getRoute = async (req, res) => {
  try {
    const { startLng, startLat, endLng, endLat } = req.query;

    if (!startLng || !startLat || !endLng || !endLat) {
      return res.status(400).json({ success: false, message: 'Please provide all coordinates (startLng, startLat, endLng, endLat)' });
    }

    const routeData = await calculateRoute(startLng, startLat, endLng, endLat);

    if (routeData.success) {
      res.status(200).json(routeData);
    } else {
      res.status(404).json(routeData);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
