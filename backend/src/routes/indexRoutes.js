import express from 'express';
import {
    getSiteByID
} from '../controllers/indexController.js';

const router = express.Router();

router.get('/site/:siteId', getSiteByID);

export default router;