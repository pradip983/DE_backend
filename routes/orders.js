// routes/orderRoutes.js
import express from 'express';
import Order from '../models/Order.js';
import Hotel from '../models/Hotel.js'; // Adjust the path as necessary
import mongoose from 'mongoose';
const router = express.Router();

// ✅ Create an order
router.post('/create', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    console.log('Created order:', newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});


router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;

    const hotelObjectId = new mongoose.Types.ObjectId(hotelId);

    // 1. Get orders of the current hotel
    const hotelOrders = await Order.find({
      hotelId: hotelObjectId,
      status: 'pending',
      fulfilledBy: null,
    });

    // 2. Get connected hotels
    const myHotel = await Hotel.findById(hotelObjectId);
    if (!myHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const connectedHotelIds = (myHotel.connectedHotels || []).map(id =>
      new mongoose.Types.ObjectId(id)
    );

    // 3. Get pending & unfulfilled orders from connected hotels
    const unfulfilledConnectedOrders = await Order.find({
      hotelId: { $in: connectedHotelIds },
      status: 'pending',
      fulfilledBy: null,
    });

    // 4. Combine both arrays
    const allOrders = [...hotelOrders, ...unfulfilledConnectedOrders];

    // 5. Send as a single 'orders' array
    res.json({ orders: allOrders });

  } catch (err) {
    console.error('❌ Error fetching combined orders:', err);
    res.status(500).json({
      message: 'Failed to fetch combined orders',
      error: err.message,
    });
  }
});

router.delete('/delete/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (err) {
    console.error('❌ Error deleting order:', err);
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
});



router.post('/:orderId/fulfill', async (req, res) => {
  try {
    const { hotelId } = req.body;
    console.log('Hotel ID:', hotelId);
    const { orderId } = req.params;
    console.log('Order ID:', orderId);

    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required to fulfill order' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'fulfilled', fulfilledBy: hotelId },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order fulfilled successfully', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fulfill order', error: err.message });
  }
});


export default router;
