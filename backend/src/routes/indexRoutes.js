import express from 'express';
import {
    getSiteByID,
    getStatusByID
} from '../controllers/indexController.js';

const router = express.Router();

// GET /api/site/:siteId
// Example: /api/site/1
router.get('/site/:siteId', getSiteByID);

// GET /api/status/:siteId&dataType
// Example: /api/status/1?dataType=Historical
router.get('/status/:siteId', getStatusByID);

export default router;