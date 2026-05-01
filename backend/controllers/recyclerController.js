import Recycler from '../models/Recycler.js';

// @desc    Create or update recycler profile
// @route   POST /api/recyclers
// @access  Private/Recycler
export const createRecyclerProfile = async (req, res) => {
  try {
    const { businessName, address, longitude, latitude, acceptedMaterials } = req.body;

    const profileData = {
      user: req.user._id,
      businessName,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      acceptedMaterials: acceptedMaterials ? acceptedMaterials.split(',').map(m => m.trim()) : undefined,
    };

    let recycler = await Recycler.findOne({ user: req.user._id });

    if (recycler) {
      recycler = await Recycler.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileData },
        { new: true }
      );
    } else {
      recycler = await Recycler.create(profileData);
    }

    res.status(200).json({ success: true, recycler });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby recyclers within 10km
// @route   GET /api/recyclers/nearby
// @access  Public
export const getNearbyRecyclers = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'Please provide longitude and latitude' });
    }

    const recyclers = await Recycler.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // 10km in meters
        },
      },
    }).populate('user', 'name email phone');

    res.status(200).json({ success: true, count: recyclers.length, recyclers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
