import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  available: { type: Boolean, default: true },
  reorderLevel: { type: Number, required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }
});

export default mongoose.model('Inventory', inventorySchema);