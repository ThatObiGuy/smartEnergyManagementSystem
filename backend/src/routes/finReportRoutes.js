import express from 'express';
import {
    getGrossSavingsAllProvidersBySiteID,
    finReportBySiteID,
    getDailySaleToGridBySiteID
} from '../controllers/finReportController.js';

const router = express.Router();

router.get('/grossSavingsAllProviders/:siteId', getGrossSavingsAllProvidersBySiteID);
router.get('/runTime/:siteId', finReportBySiteID);
router.get('/dailySaleToGrid/:siteId', getDailySaleToGridBySiteID);

export default router;
