import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  connectedHotels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel' // Reference to other hotels
    }
  ],
  distance: Number
});

export default mongoose.model('Hotel', hotelSchema);