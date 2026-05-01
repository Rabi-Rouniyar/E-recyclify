import express from 'express';
import { createRecyclerProfile, getNearbyRecyclers } from '../controllers/recyclerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('recycler', 'admin'), createRecyclerProfile);
router.get('/nearby', getNearbyRecyclers);

export default router;
