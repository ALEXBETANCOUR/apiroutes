import { Router } from 'express';
import youtubeRoutes from './youtube.routes.js';

const indexRoutes = Router();

indexRoutes.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API YouTube Backend funcionando correctamente',
    endpoints: {
      youtube: '/api/youtube'
    }
  });
});

indexRoutes.use('/youtube', youtubeRoutes);

export default indexRoutes;
