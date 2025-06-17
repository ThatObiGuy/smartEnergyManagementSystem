import express from 'express';
import { getCurrentWeatherByLocation } from '../controllers/weatherController.js';

const router = express.Router();

// GET /api/weather/current/:location
// Example: /api/weather/current/Moate,Westmeath
router.get('/current/:location', getCurrentWeatherByLocation);

export default router;