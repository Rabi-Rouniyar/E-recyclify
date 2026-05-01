import PickupRequest from '../models/PickupRequest.js';
import Recycler from '../models/Recycler.js';
import sendEmail from '../utils/emailService.js';

// @desc    Create a new pickup request
// @route   POST /api/pickups
// @access  Private/User
export const createPickupRequest = async (req, res) => {
  try {
    const { productName, brandModel, estimatedPrice, pickupDate, pickupTime, longitude, latitude, phoneNumber } = req.body;
    
    // Image will come from local multer middleware
    const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : 'https://placehold.co/400x300/e2e8f0/475569?text=No+Image+Provided';

    const pickup = await PickupRequest.create({
      user: req.user._id,
      productName,
      brandModel,
      image,
      estimatedPrice,
      pickupDate,
      pickupTime,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      phoneNumber,
    });

    res.status(201).json({ success: true, pickup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's pickup requests
// @route   GET /api/pickups/my-requests
// @access  Private/User
export const getMyRequests = async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ user: req.user._id }).populate('recycler', 'businessName address');
    res.status(200).json({ success: true, count: pickups.length, pickups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby pending pickup requests (10km)
// @route   GET /api/pickups/nearby
// @access  Private/Recycler
export const getNearbyRequests = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'Please provide longitude and latitude' });
    }

    const pickups = await PickupRequest.find({
      status: 'Pending',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // 10km
        },
      },
    }).populate('user', 'name phone');

    res.status(200).json({ success: true, count: pickups.length, pickups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update pickup request status (Accept, Complete, Reject)
// @route   PUT /api/pickups/:id/status
// @access  Private/Recycler
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    const updateData = { status };

    // If accepted, link the logged in recycler
    if (status === 'Accepted') {
      const recycler = await Recycler.findOne({ user: req.user._id });
      if (!recycler) {
        return res.status(404).json({ success: false, message: 'Recycler profile not found' });
      }
      updateData.recycler = recycler._id;
    }

    pickup = await PickupRequest.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('user', 'name email');

    // Fire off email notification asynchronously (we don't await blocking the response if email fails)
    try {
      const emailHtml = `
        <h2>E-Recyclify Request Update</h2>
        <p>Hi ${pickup.user.name},</p>
        <p>Your pickup request for the <strong>${pickup.productName}</strong> has been updated to: <strong><span style="color: green;">${status}</span></strong>.</p>
        <p>Thank you for contributing to a greener planet!</p>
      `;

      sendEmail({
        email: pickup.user.email,
        subject: `Update on your E-Waste Pickup: ${status}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }

    res.status(200).json({ success: true, pickup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recycler's accepted pickup requests
// @route   GET /api/pickups/accepted
// @access  Private/Recycler
export const getAcceptedPickups = async (req, res) => {
  try {
    const recycler = await Recycler.findOne({ user: req.user._id });
    if (!recycler) {
      return res.status(404).json({ success: false, message: 'Recycler profile not found' });
    }

    // Find all pickups assigned to this recycler that are still in 'Accepted' status (not 'Completed')
    const pickups = await PickupRequest.find({ 
      recycler: recycler._id,
      status: 'Accepted'
    }).populate('user', 'name phone email');
    res.status(200).json({ success: true, count: pickups.length, pickups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
