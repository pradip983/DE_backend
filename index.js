import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import ordersRouter from './routes/orders.js';
import inventoryRouter from './routes/inventory.js';
import hotelsRouter from './routes/hotels.js';
import transfersRouter from './routes/transfers.js';
import userRouter from './routes/user.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Proper CORS setup
const corsOptions = {
  origin: 'http://localhost:5173', // Adjust this to your frontend URL if different
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // optional if you're using cookies/auth headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://vasanpradip06:vasan51645@cluster0.mdlqm.mongodb.net/hotel-food-management')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ API Routes
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/transfers', transfersRouter);
app.use('/api/user', userRouter);



// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
