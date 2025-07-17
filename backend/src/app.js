
import express from 'express';
import cors from 'cors';
import userRouter from './routers/userRouter.js'
import productsRouter from './routers/productsRouter.js'
import reviewRouter from './routers/reviewRouter.js';
import orderRoutes from './routers/orderRouter.js';
import reportRouter from './routers/reportRouter.js';
import categoryRouter from './routers/categoryRouter.js';

const app = express();
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.get("/", (req, res) => {
    res.send("¡Backend funcionando correctamente con Mongo BD local!");
  });
app.use('/api/auth', userRouter);
app.use ('/api/products',productsRouter);
app.use('/api/usuarios', userRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/orders', orderRoutes);
//GET /api/reviews/promedios
app.use('/api/reviews/promedios', reviewRouter);
app.use('/api/report', reportRouter);

app.use('/api/categories', categoryRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
