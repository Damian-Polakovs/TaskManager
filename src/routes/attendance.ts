import express from 'express';
import {
  getAttendances,
  getAttendance,
  createAttendance,
  createBulkAttendance,
  updateAttendance,
  deleteAttendance
} from '../controllers/attendance';

const router = express.Router();

router.get('/', getAttendances);
router.get('/:id', getAttendance);
router.post('/', createAttendance);
router.post('/bulk', createBulkAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router;
