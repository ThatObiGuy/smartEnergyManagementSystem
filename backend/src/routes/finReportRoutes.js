import express from 'express';
import { getGrossSavingsBySiteID } from '../controllers/finReportController.js';

const router = express.Router();

router.get('/grossSavings/:siteId', getGrossSavingsBySiteID);

export default router;