import express from 'express';
import InventoryItem from '../models/Inventory.js'; // Adjust the path as necessary

const router = express.Router();

// Get all inventory items
// router.get('/', async (req, res) => {
//   try {
//     const items = await InventoryItem.find();
//     console.log(items);
//     if (!items) {
//       return res.status(404).json({ message: 'No items found' });
//     }
//     // Check if items is an array
//     if (!Array.isArray(items)) {
//       return res.status(500).json({ message: 'Unexpected response format' });
//     }
//     // Log the items for debugging
    
//     // Return the items as JSON
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


router.get('/:hotelId', async (req, res) => {
  try {
    const items = await InventoryItem.find({ hotelId: req.params.hotelId });
   
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory', error });
  }
});


router.post('/', async (req, res) => {
  try {
    const newItem = await InventoryItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add item', error });
  }
});


// Create new inventory item
// router.post('/', async (req, res) => {
//   const item = new InventoryItem(req.body);
//   try {
//     const newItem = await item.save();
//     res.status(201).json(newItem);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });


router.delete('/:id', async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error });
  }
});


// Update inventory item
// router.patch('/:id', async (req, res) => {
//   try {
//     const item = await InventoryItem.findById(req.params.id);
//     if (!item) {
//       return res.status(404).json({ message: 'Item not found' });
//     }
    
//     Object.assign(item, req.body);
//     const updatedItem = await item.save();
//     res.json(updatedItem);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

export default router;