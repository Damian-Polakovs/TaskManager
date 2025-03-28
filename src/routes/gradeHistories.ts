import express from 'express';
import {
    getGradeHistories,
    getGradeHistoryById,
    createGradeHistory,
    updateGradeHistory,
    deleteGradeHistory,
} from '../controllers/gradeHistories';
import { checkJwt } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.get('/', checkJwt, getGradeHistories);
router.get('/:id', checkJwt, getGradeHistoryById);
router.post('/', checkJwt, createGradeHistory);
router.put('/:id', checkJwt, updateGradeHistory);
router.delete('/:id', checkJwt, deleteGradeHistory);

export default router;