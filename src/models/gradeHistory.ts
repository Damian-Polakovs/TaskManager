import { ObjectId } from "mongodb";

export interface Score {
    type: 'exam' | 'quiz' | 'homework';
    score: number;
}

export interface GradeHistory {
    student_id: number;
    student_name: string;
    class_id: number;
    scores: Score[];
    createdAt?: Date;
    updatedAt?: Date;
}