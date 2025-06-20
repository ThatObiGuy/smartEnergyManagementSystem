import express from 'express';
import {
    getSiteByID
} from '../controllers/indexController.js';

const router = express.Router();

// GET /api/site/:siteId
// Example: /api/site/1
router.get('/site/:siteId', getSiteByID);

// GET /api/grid-independence?site_id={id}
//router.get('/site/:siteId', getIndepSummary);

export default router;