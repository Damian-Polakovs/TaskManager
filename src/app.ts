import express from 'express';
import cors from 'cors';
import routes from './routes';
import { connectToDatabase } from './utils/database';

const app = express();

//Configure CORS
app.use(cors({
    origin: process.env.CLIENT_ORIGIN_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400, //24 hours
}));

//Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Mount routes
app.use('/', routes);

//Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

//Connect to database and start server
const PORT = process.env.PORT || 3000;

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

export default app;