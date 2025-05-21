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
    required: true 
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
fechaingreso :{
type: Date,
default: Date.now
},

})
export default mongoose.model('Product', productSchema);
