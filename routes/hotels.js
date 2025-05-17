import express from 'express';
import Hotel from '../models/Hotel.js';

const router = express.Router();

// Get all hotels
router.get('/:hotelId/connected', async (req, res) => {
  const { hotelId } = req.params;

  try {
    const hotel = await Hotel.findById(hotelId).populate('connectedHotels', 'name address phoneNumber email');
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    res.json({ connectedHotels: hotel.connectedHotels });
  } catch (error) {
    res.status(500).json({ message: "Error fetching connected hotels", error: error.message });
  }
});

// Create new hotel
router.post('/', async (req, res) => {
  const hotel = new Hotel(req.body);
  try {
    const newHotel = await hotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// routes/hotelRoutes.js or similar
router.post('/connect', async (req, res) => {
  const { hotelId, connectWithId } = req.body;
  

  try {
    const hotel = await Hotel.findById(hotelId);
    const otherHotel = await Hotel.findById(connectWithId);

    if (!hotel || !otherHotel) {
      return res.status(404).json({ message: "One or both hotels not found" });
    }

    // Avoid duplicates
    if (!hotel.connectedHotels.includes(connectWithId)) {
      hotel.connectedHotels.push(connectWithId);
      await hotel.save();
    }

    res.json({ message: "Hotels connected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error connecting hotels", error: error.message });
  }
});

export default router;