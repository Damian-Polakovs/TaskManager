import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../utils/database';
import { Attendance, BulkAttendanceData } from '../models/attendance';

const COLLECTION = 'attendances';

export const getAttendances = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const attendances = await db.collection(COLLECTION).find().toArray();
    res.json(attendances);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    res.status(500).json({ message: 'Error fetching attendances', error });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const attendance = await db.collection(COLLECTION).findOne({ _id: new ObjectId(req.params.id) });
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
};

export const createAttendance = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const attendance: Attendance = {
      ...req.body,
      dateCreated: new Date(),
      lastUpdated: new Date()
    };
    const result = await db.collection(COLLECTION).insertOne(attendance);
    res.status(201).json({ ...attendance, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ message: 'Error creating attendance', error });
  }
};

export const createBulkAttendance = async (req: Request, res: Response) => {
  try {
    console.log('Received bulk attendance request:', req.body);
    const db = await getDb();
    const data: BulkAttendanceData = req.body;
    
    if (!data.class_id || !data.date || !Array.isArray(data.records)) {
      console.log('Invalid request format:', data);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid request format. Required fields: class_id, date, and records array',
        data: null
      });
    }

    console.log('Creating attendance record with class_id:', data.class_id);
    console.log('Date:', new Date(data.date));
    console.log('Students records count:', data.records.length);

    const attendance: Attendance = {
      class_id: data.class_id,
      date: new Date(data.date),
      students: data.records.map(record => ({
        student_id: record.student_id,
        student_name: record.student_name,
        status: record.status,
        comments: record.comments
      })),
      dateCreated: new Date(),
      lastUpdated: new Date()
    };

    console.log('Attempting to insert into collection:', COLLECTION);
    const result = await db.collection(COLLECTION).insertOne(attendance);
    console.log('Insert result:', result);
    
    const savedAttendance: Attendance = {
      ...attendance,
      _id: result.insertedId
    };

    res.status(201).json({
      success: true,
      message: 'Attendance record created successfully',
      data: savedAttendance
    });
  } catch (error) {
    console.error('Error creating attendance:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ 
      success: false,
      message: 'Error creating attendance',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null
    });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const attendance = {
      ...req.body,
      lastUpdated: new Date()
    };
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: attendance },
      { returnDocument: 'after' }
    );
    
    if (!result || !result.value) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(result.value);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance', error });
  }
};

export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION).findOneAndDelete(
      { _id: new ObjectId(req.params.id) }
    );
    
    if (!result || !result.value) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ message: 'Error deleting attendance', error });
  }
};
