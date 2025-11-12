import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/ServiceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);


// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(` Server rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const allowedOrigins = [
  'http://localhost:5173',
  'https://adamastudo.vercel.app',
  'https://adamastudo-git-main-seu-usuario.vercel.app', 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

startServer();