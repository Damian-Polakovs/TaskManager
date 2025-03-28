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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const users_1 = __importDefault(require("./routes/users"));
const gradeHistories_1 = __importDefault(require("./routes/gradeHistories"));
const database_1 = require("./database");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// Middleware
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
// Routes
app.get("/ping", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        message: "hello",
    });
}));
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/gradeHistories', gradeHistories_1.default);
// Connect to database before starting server
(0, database_1.connectToDatabase)().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port --", PORT);
    });
}).catch(error => {
    console.error("Database connection failed", error);
    process.exit(1);
});
