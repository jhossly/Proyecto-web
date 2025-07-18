// File: backend/src/models/Products.js
import mongoose, { Schema } from "mongoose";
const productSchema =new mongoose.Schema({

nombre :{
    type: String, 
    required: true 
},
descripcion :{
    
    type: String
},
precio:{
type: Number,
required: true 

},
categoria:{
    type: String,
    required: true ,
    

},
subcategoria :{
    type: String,
    required :true,
    default: 'General'
},
stock:{
    type :Number,
    default: 0
},
imagen: { 
    type: String
 },
 conIVA: { 
    type: Boolean, default: false ,
    required: true 

 },
fechaIngreso :{
type: Date,
default: Date.now
},
activo: {
    type: Boolean,
    default: true
  },
  fechaEliminacion: {
    type: Date,
    default: null
  }

})

export default mongoose.model('Product', productSchema);
