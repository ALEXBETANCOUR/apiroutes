import { Router } from 'express';
import {
  getYoutubeRecords,
  getYoutubeRecordById,
  createYoutubeRecord,
  updateYoutubeRecord,
  deleteYoutubeRecord
} from '../controllers/youtube.controllers.js';

const router = Router();

router.get('/', getYoutubeRecords);
router.get('/:id', getYoutubeRecordById);
router.post('/', createYoutubeRecord);
router.put('/:id', updateYoutubeRecord);
router.delete('/:id', deleteYoutubeRecord);

export default router;
