
import express from 'express';
import cors from 'cors';
import userRouter from './routers/userRouter.js'
import productsRouter from './routers/productsRouter.js'
import ventasRouter from './routers/ventasRouter.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.get("/", (req, res) => {
    res.send("¡Backend funcionando correctamente con Mongo BD local!");
  });
app.use('/api/auth', userRouter);
app.use ('/api/products',productsRouter);
app.use ('/api/ventas',ventasRouter);
app.use('/api/usuarios', userRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
