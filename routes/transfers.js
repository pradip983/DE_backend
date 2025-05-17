import express from 'express';
import TransferRequest from '../models/Transfer.js';
import InventoryItem from '../models/Inventory.js';
import Order from '../models/Order.js';
import Hotel from '../models/Hotel.js';
const router = express.Router();


router.get('/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;
    console.log('Fetching transfer orders for hotel:', hotelId);

    const fulfilledByMe = await Order.find({
      fulfilledBy: hotelId,
      hotelId: { $ne: hotelId },
      status: 'fulfilled',
    });

    const fulfilledForMe = await Order.find({
      hotelId: hotelId,
      fulfilledBy: { $ne: null, $ne: hotelId },
      status: 'fulfilled',
    });

    const allTransfers = [...fulfilledByMe, ...fulfilledForMe];

    // Get all unique hotelIds and fulfilledBy IDs
    const hotelIds = new Set();
    allTransfers.forEach(order => {
      hotelIds.add(order.hotelId);
      if (order.fulfilledBy) hotelIds.add(order.fulfilledBy);
    });

    // Fetch hotel names
    const hotels = await Hotel.find({ _id: { $in: Array.from(hotelIds) } });
    const hotelMap = {};
    hotels.forEach(hotel => {
      hotelMap[hotel._id] = hotel.name;
    });

    // Add readable hotel names to each order
    const enrichedTransfers = allTransfers.map(order => ({
      ...order._doc,
      requestingHotelName: hotelMap[order.hotelId] || 'Unknown Hotel',
      fulfillingHotelName: hotelMap[order.fulfilledBy] || 'Unknown Hotel',
    }));

    res.json({ transfers: enrichedTransfers });
  } catch (err) {
    console.error('Error fetching transfer orders:', err);
    res.status(500).json({ message: 'Failed to fetch transfer orders', error: err.message });
  }
});




export default router;