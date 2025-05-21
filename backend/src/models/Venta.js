import mongoose from "mongoose";
const ventasSchema =new mongoose.Schema ({
usuarioId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
productos: [
    {
      productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      },
      precioUnitario: {
        type: Number,
        required: true
      }
    }
  ],
totalVenta :{
type: Number,
required :true

},
fecha :{
    type:Date,
    default : Date.now
},
metodoPago :{
    type: String,
    enum: ["efectivo", "tarjeta", "transferencia"], 
    required: true
}
})

export default mongoose.model('Ventas' ,ventasSchema)
