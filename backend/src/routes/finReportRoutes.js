import express from 'express';
import {
    getGrossSavingsBySiteID,
    getGrossSavingsAllProviders,
    getInstallDateBySiteID,
    getInstallCostBySiteID,
    getDailySaleToGridBySiteID
} from '../controllers/finReportController.js';

const router = express.Router();

router.get('/grossSavings/:siteId', getGrossSavingsBySiteID);
router.get('/grossSavingsAllProviders/:siteId', getGrossSavingsAllProviders);
router.get('/installationDate/:siteId', getInstallDateBySiteID);
router.get('/installationCost/:siteId', getInstallCostBySiteID);
router.get('/dailySaleToGrid/:siteId', getDailySaleToGridBySiteID);

export default router;
