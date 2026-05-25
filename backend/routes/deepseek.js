const express = require('express');
const router = express.Router();
const {
  getAIResponse,
  getInventoryRecommendations,
} = require('../controllers/deepseekController');

// POST /api/deepseek or /api/deepseek/chat
router.post('/', getAIResponse);
router.post('/chat', getAIResponse);
router.post('/recommendations', getInventoryRecommendations);

module.exports = router;
