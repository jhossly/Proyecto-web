// Conexion a MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Local conectado"))
  .catch(err => console.error(err));
