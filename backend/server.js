import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import protectedToken from './middleware/authMiddleware.js';
import transactionRoutes from './routes/transactionRoutes.js';
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config(); 
connectDatabase();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use((req, res, next) => {
  res.status(404);
  next(new Error("Route Not Found"));
});
app.use(errorHandler);

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

app.get('/', (req, res) => {
    res.send("API Running ...");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`)
})