import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
  requestingHotelId: { type: String, required: true },
  requestingHotelName: { type: String, required: true },
  receivingHotelId: { type: String, required: true },
  receivingHotelName: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { 
    type: String,
    default: 'pending'
  },
  orderItemId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transfer', transferSchema);
