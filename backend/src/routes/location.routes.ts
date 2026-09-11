import { Router } from 'express';
import { geocode, reverse } from '../controllers/location.controller';

const router = Router();

router.get('/geocode', geocode);
router.get('/reverse', reverse);

export default router;
