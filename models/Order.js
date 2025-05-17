import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: String,
  itemName: String,
  quantity: Number,
  hotelId: String, // hotel that created the order
  status: { type: String, default: 'pending' }, // pending, fulfilled, rejected
  fulfilledBy: { type: String, default: null }, // another hotel fulfilling the order
}, { timestamps: true }); // <-- optional: adds createdAt and updatedAt

export default mongoose.model('Order', OrderSchema);
