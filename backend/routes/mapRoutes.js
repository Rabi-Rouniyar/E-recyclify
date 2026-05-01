import express from 'express';
import { getRoute } from '../controllers/mapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/route', protect, getRoute);

export default router;
