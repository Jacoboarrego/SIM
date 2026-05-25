const express = require('express');
const router = express.Router();
const { queryDeepSeek } = require('../services/deepseekService');

// POST /api/deepseek
router.post('/', async (req, res) => {
  try {
    const result = await queryDeepSeek(req.body);
    res.json(result);
  } catch (err) {
    console.error('DeepSeek error', err.message || err);
    res.status(502).json({ message: 'Error calling AI service' });
  }
});

module.exports = router;
