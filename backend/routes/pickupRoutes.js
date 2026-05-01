import express from 'express';
import { createPickupRequest, getMyRequests, getNearbyRequests, updateRequestStatus, getAcceptedPickups } from '../controllers/pickupController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('user'), upload.single('image'), createPickupRequest);
router.get('/my-requests', protect, authorize('user'), getMyRequests);
router.get('/nearby', protect, authorize('recycler', 'admin'), getNearbyRequests);
router.get('/accepted', protect, authorize('recycler', 'admin'), getAcceptedPickups);
router.put('/:id/status', protect, authorize('recycler', 'admin'), updateRequestStatus);

export default router;
