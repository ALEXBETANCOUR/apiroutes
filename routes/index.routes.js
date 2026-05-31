import { Router } from 'express';
import youtubeRoutes from './youtube.routes.js';

const router = Router();

router.use('/youtube', youtubeRoutes);

export default router;
