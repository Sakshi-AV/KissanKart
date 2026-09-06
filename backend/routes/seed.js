const express = require('express');
const router = express.Router();
const seedData = require('../utils/seeder');
const Storage = require('../services/storage');

router.post('/', async (req, res) => {
  try {
    // If requested with force=true, clear store
    if (req.body.force) {
      Storage.setMemStore({
        users: [],
        farmers: [],
        products: [],
        orders: [],
        reviews: []
      });
    }
    await seedData();
    res.status(200).json({ success: true, message: 'Database seeded successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
