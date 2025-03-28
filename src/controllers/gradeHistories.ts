import { Request, Response, NextFunction } from 'express';
import { GradeHistory } from '../models/gradeHistory';
import { ObjectId } from 'mongodb';
import Joi from 'joi';
import { AuthResult } from 'express-oauth2-jwt-bearer';
import { RequestHandler } from 'express-serve-static-core';
import { getDb } from '../utils/database';

// Export the interface
export interface AuthRequest extends Request {
    auth?: AuthResult;
}

// Validation schema
const scoreSchema = Joi.object({
    type: Joi.string().valid('exam', 'quiz', 'homework').required(),
    score: Joi.number().min(0).max(100).required()
});

const gradeHistorySchema = Joi.object({
    student_id: Joi.number().integer().required(),
    student_name: Joi.string().required(),
    class_id: Joi.number().integer().required(),
    scores: Joi.array().items(scoreSchema).required()
});

export const getGradeHistories: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const authReq = req as AuthRequest;
        // Add this log to see the auth info
        console.log('Auth payload:', authReq.auth?.payload);
        
        const db = await getDb();
        const gradeHistories = await db.collection('gradeHistories').find({}).toArray();
        res.json(gradeHistories);
    } catch (error) {
        next(error);
    }
};

export const getGradeHistoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = await getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const gradeHistory = await db.collection('gradeHistories').findOne({ 
            _id: new ObjectId(id) 
        });
        
        if (!gradeHistory) {
            return res.status(404).json({ message: 'Grade history not found' });
        }
        
        res.json(gradeHistory);
    } catch (error) {
        next(error);
    }
};

export const createGradeHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = await getDb();
        const newGradeHistory = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('gradeHistories').insertOne(newGradeHistory);
        
        res.status(201).json({
            _id: result.insertedId,
            ...newGradeHistory
        });
    } catch (error) {
        next(error);
    }
};

export const updateGradeHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = await getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const result = await db.collection('gradeHistories').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result?.value) {
            return res.status(404).json({ message: 'Grade history not found' });
        }

        res.json(result.value);
    } catch (error) {
        next(error);
    }
};

export const deleteGradeHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const db = await getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const result = await db.collection('gradeHistories').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Grade history not found' });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};