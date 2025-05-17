import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    hotelName: { type: String,  },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }, 
    image: { type: String,  },
    

}, { timestamps: true });

export default  mongoose.model("User", UserSchema);
