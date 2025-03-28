import { Request, Response, NextFunction } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

// Configure JWT authentication middleware
export const checkJwt = auth({
    audience: 'http://localhost:3000',
    issuerBaseURL: `https://s00236491.eu.auth0.com`,
});

// Error handler for authentication errors
export const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    next(err);
}; 