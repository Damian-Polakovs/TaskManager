"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gradeHistories_1 = require("../controllers/gradeHistories");
const router = express_1.default.Router();
router.get('/', gradeHistories_1.getGradeHistories);
router.get('/:id', gradeHistories_1.getGradeHistoryById);
router.post('/', gradeHistories_1.createGradeHistory);
router.put('/:id', gradeHistories_1.updateGradeHistory);
router.delete('/:id', gradeHistories_1.deleteGradeHistory);
exports.default = router;
