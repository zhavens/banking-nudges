import { Router } from 'express';

export const loggingRoute = Router();

loggingRoute.post('/log', (req, res) => {
    console.log('Echo called.');
    res.status(200).json({ status: "ECHO" });
});