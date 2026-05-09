import { Router } from 'express';
import {
  getAllYoutubeCompanies,
  getYoutubeCompanyById,
  postYoutubeCompany,
  putYoutubeCompany,
  deleteYoutubeCompany,
  getYoutubeCompaniesByCountry
} from '../controllers/youtube.controllers.js';

const router = Router();

router.get('/', getAllYoutubeCompanies);
router.post('/', postYoutubeCompany);
router.get('/pais/:pais', getYoutubeCompaniesByCountry);
router.get('/:id', getYoutubeCompanyById);
router.put('/:id', putYoutubeCompany);
router.delete('/:id', deleteYoutubeCompany);

export default router;
