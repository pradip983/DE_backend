import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';

const router = express.Router();

router.post('/registerW', async (req, res) => {
  const { FirstName, LastName, email, password, hotelId } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new waiter
    const waiter = await User.create({
      FirstName,
      LastName,
      email,
      password: hashedPassword,
      role: 'waiter',
      hotelId
    });

    // Create plain object and attach hotel name to response (not stored in DB)
    const userWithHotelName = {
      ...waiter.toObject(),
      hotelName: hotel.name
    };


  


    // Respond with full object
    res.status(201).json({
      message: "Waiter registered",
      user: userWithHotelName
    });

  } catch (error) {
    console.error("Register waiter error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.post('/registerA', async (req, res) => {
  const { FirstName, LastName, email, password, hotelName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({
    FirstName, LastName, email, password: hashedPassword, role: 'admin', hotelName
  });

  const newHotel = await Hotel.create({
    name: hotelName,
    email: email,
    phoneNumber: "1234567890",
    address: "123 Main St",
    distance: 0,
    createdBy: admin._id
  });

  admin.hotelId = newHotel._id;
  await admin.save();

  res.status(201).json({ message: "Admin & Hotel created", user: admin });
});

router.post('/loginuser', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    let hotelName = null;

    // Only try to find hotel name if user has a hotelId
    if (user.hotelId) {
      const hotel = await Hotel.findById(user.hotelId);
      hotelName = hotel?.name || null;
     
    }
   
    const userObj = user.toObject();
    userObj.hotelName = hotelName;

    res.json({ message: "Login successful", user: userObj });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});


  export default router;



