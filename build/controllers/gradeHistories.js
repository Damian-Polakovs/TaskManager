"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGradeHistory = exports.updateGradeHistory = exports.createGradeHistory = exports.getGradeHistoryById = exports.getGradeHistories = void 0;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const joi_1 = __importDefault(require("joi"));
// Validation schema
const scoreSchema = joi_1.default.object({
    type: joi_1.default.string().valid('exam', 'quiz', 'homework').required(),
    score: joi_1.default.number().min(0).max(100).required()
});
const gradeHistorySchema = joi_1.default.object({
    student_id: joi_1.default.number().integer().required(),
    class_id: joi_1.default.number().integer().required(),
    scores: joi_1.default.array().items(scoreSchema).required()
});
const getGradeHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        // Build query based on allowed filters
        let query = {};
        if (req.query.student_id) {
            query.student_id = parseInt(req.query.student_id);
        }
        if (req.query.class_id) {
            query.class_id = parseInt(req.query.class_id);
        }
        if (req.query.score_type) {
            query['scores.type'] = req.query.score_type;
        }
        if (req.query.min_score) {
            query['scores.score'] = { $gte: parseInt(req.query.min_score) };
        }
        // Projection
        let projection = {};
        if (req.query.fields) {
            const fields = req.query.fields.split(',');
            fields.forEach(field => projection[field] = 1);
        }
        // Sorting
        let sort = { class_id: 1 }; // default sort
        if (req.query.sort) {
            try {
                sort = JSON.parse(req.query.sort);
            }
            catch (e) {
                return res.status(400).json({ message: 'Invalid sort parameter' });
            }
        }
        const [gradeHistories, total] = yield Promise.all([
            database_1.gradeHistoriesCollection
                .find(query)
                .project(projection)
                .sort(sort)
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            database_1.gradeHistoriesCollection.countDocuments(query)
        ]);
        res.status(200).json({
            data: gradeHistories,
            metadata: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    }
    catch (error) {
        console.error('Error in getGradeHistories:', error);
        res.status(500).json({ message: 'Failed to retrieve grade histories' });
    }
});
exports.getGradeHistories = getGradeHistories;
const getGradeHistoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const gradeHistory = yield database_1.gradeHistoriesCollection.findOne({
            _id: new mongodb_1.ObjectId(id)
        });
        if (!gradeHistory) {
            return res.status(404).json({ message: `Grade history not found with id: ${id}` });
        }
        res.status(200).json(gradeHistory);
    }
    catch (error) {
        console.error('Error in getGradeHistoryById:', error);
        res.status(500).json({ message: 'Failed to retrieve grade history' });
    }
});
exports.getGradeHistoryById = getGradeHistoryById;
const createGradeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const { error, value } = gradeHistorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const gradeHistory = Object.assign(Object.assign({}, value), { dateCreated: new Date(), lastUpdated: new Date() });
        const result = yield database_1.gradeHistoriesCollection.insertOne(gradeHistory);
        res.status(201)
            .location(`/api/v1/gradeHistories/${result.insertedId}`)
            .json({
            message: 'Grade history created successfully',
            id: result.insertedId
        });
    }
    catch (error) {
        console.error('Error in createGradeHistory:', error);
        res.status(500).json({ message: 'Failed to create grade history' });
    }
});
exports.createGradeHistory = createGradeHistory;
const updateGradeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        // Validate request body
        const { error, value } = gradeHistorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const result = yield database_1.gradeHistoriesCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: Object.assign(Object.assign({}, value), { lastUpdated: new Date() })
        });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Grade history not found with id: ${id}` });
        }
        res.status(200).json({
            message: 'Grade history updated successfully',
            modifiedCount: result.modifiedCount
        });
    }
    catch (error) {
        console.error('Error in updateGradeHistory:', error);
        res.status(500).json({ message: 'Failed to update grade history' });
    }
});
exports.updateGradeHistory = updateGradeHistory;
const deleteGradeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const result = yield database_1.gradeHistoriesCollection.deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Grade history not found with id: ${id}` });
        }
        res.status(200).json({ message: 'Grade history deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteGradeHistory:', error);
        res.status(500).json({ message: 'Failed to delete grade history' });
    }
});
exports.deleteGradeHistory = deleteGradeHistory;
