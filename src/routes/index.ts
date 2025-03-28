import express from 'express';
import gradeHistoriesRouter from './gradeHistories';
import attendanceRouter from './attendance';

const router = express.Router();

router.use('/grade-histories', gradeHistoriesRouter);
router.use('/attendance', attendanceRouter);

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

// Add the tasks endpoint
router.get('/tasks', async (req, res) => {
  try {
    const tasks: Task[] = []; // Now explicitly typed
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

export default router; 