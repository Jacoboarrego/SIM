const axios = require('axios');

const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:5173';
const OPENROUTER_APP_NAME = process.env.OPENROUTER_APP_NAME || 'SIM_Inventory_System';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free';

const openRouterHeaders = {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': OPENROUTER_SITE_URL,
  'X-Title': OPENROUTER_APP_NAME,
};

function buildChatPayload(prompt) {
  return {
    model: OPENROUTER_MODEL,
    messages: [
      {
        role: 'system',
        content: 'Eres un asistente experto en gestión de inventario y sistemas. Responde de manera útil y concisa.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  };
}

function buildRecommendationsPrompt(products = [], sales = []) {
  return `Analiza este inventario:\nProductos: ${JSON.stringify(products)}\nVentas recientes: ${JSON.stringify(sales)}\n\nDame 3 recomendaciones específicas para optimizar el inventario.`;
}

function formatOpenRouterResponse(data) {
  if (!data) return '';
  if (Array.isArray(data.choices) && data.choices.length > 0) {
    const choice = data.choices[0];
    if (choice.message && choice.message.content) {
      return choice.message.content;
    }
    if (choice.text) {
      return choice.text;
    }
  }
  return JSON.stringify(data, null, 2);
}

function buildFallbackMessage(prompt) {
  return {
    success: false,
    error: 'No se pudo obtener respuesta de la IA externa.',
    fallback: {
      text: 'Basado en análisis local: mantén un stock de seguridad, revisa productos cada 30 días y prioriza rotación FIFO.',
      prompt: prompt || 'No se proporcionó prompt.',
    },
  };
}

exports.getAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'El prompt es requerido y debe ser texto.',
      });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OPENROUTER_API_KEY no está configurada en el backend.',
      });
    }

    const response = await axios.post(
      `${OPENROUTER_API_URL.replace(/\/$/, '')}/chat/completions`,
      buildChatPayload(prompt),
      {
        headers: openRouterHeaders,
        timeout: 20000,
      }
    );

    const aiResponse = formatOpenRouterResponse(response.data);

    res.json({
      success: true,
      response: aiResponse,
      usage: response.data.usage,
    });
  } catch (error) {
    console.error('Error detallado:', error.response?.data || error.message || error);
    const fallback = buildFallbackMessage(req.body?.prompt);

    res.status(500).json({
      success: false,
      error: 'No se pudo obtener respuesta de la IA',
      details: error.response?.data || error.message || 'Error desconocido',
      fallback,
    });
  }
};

exports.getInventoryRecommendations = async (req, res) => {
  try {
    const { products = [], sales = [] } = req.body;
    const prompt = buildRecommendationsPrompt(products, sales);

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OPENROUTER_API_KEY no está configurada en el backend.',
      });
    }

    const response = await axios.post(
      `${OPENROUTER_API_URL.replace(/\/$/, '')}/chat/completions`,
      {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente experto en inventarios. Responde de forma clara y concreta.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      },
      {
        headers: openRouterHeaders,
        timeout: 20000,
      }
    );

    const recommendations = formatOpenRouterResponse(response.data);

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('Error de recomendaciones:', error.response?.data || error.message || error);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message || 'No se pudo obtener recomendaciones',
    });
  }
};
