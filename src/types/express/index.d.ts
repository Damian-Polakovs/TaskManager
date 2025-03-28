import { Auth0User } from 'express-oauth2-jwt-bearer';

declare global {
    namespace Express {
        interface Request {
            auth?: Auth0User;
        }
    }
} 