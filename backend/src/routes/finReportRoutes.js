import express from 'express';
import {
    getGrossSavingsBySiteID,
    getGrossSavingsAllProviders,
    getDailySaleToGridBySiteID
} from '../controllers/finReportController.js';

const router = express.Router();

router.get('/grossSavings/:siteId', getGrossSavingsBySiteID);
router.get('/grossSavingsAllProviders/:siteId', getGrossSavingsAllProviders);
router.get('/dailySaleToGrid/:siteId', getDailySaleToGridBySiteID);

export default router;
