// @google/genai is an ESM-only package. Plain require() of it throws
// ERR_REQUIRE_ESM on Node 16/18/20 (the doc's stated minimum Node version),
// even though it happens to work via require() on newer Node runtimes.
// Dynamic import() is used instead so this works across the full supported
// Node range without a silent compatibility trap.
let cachedClientPromise = null;

const getGenAIClient = () => {
  if (!cachedClientPromise) {
    cachedClientPromise = import('@google/genai').then(
      ({ GoogleGenAI }) => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    );
  }
  return cachedClientPromise;
};

/**
 * Deterministic, clearly-labeled fallback insight used when GEMINI_API_KEY
 * is not configured, per the reference document's "resilient fallback mode"
 * requirement (Description section).
 */
const buildFallbackInsight = (weather) => {
  const { temperature, condition, city } = weather;
  let recommendation = 'Stay hydrated and dress comfortably for the day.';

  if (typeof temperature === 'number') {
    if (temperature >= 32) {
      recommendation = 'It is quite hot — stay hydrated, wear light cotton clothes, and avoid strenuous outdoor activity during peak sun hours.';
    } else if (temperature <= 10) {
      recommendation = 'It is cold — wear warm layers and limit prolonged outdoor exposure.';
    } else {
      recommendation = 'Conditions are moderate — light layers should be comfortable for most outdoor activities.';
    }
  }

  return {
    summary: `Current conditions in ${city || 'the selected location'}: ${condition || 'unknown'}, around ${temperature ?? 'N/A'}°C.`,
    recommendation,
    fallback: true,
    message: 'GEMINI_API_KEY is not configured — showing a rule-based fallback recommendation.'
  };
};

/**
 * Generates a natural-language weather summary and a personalized
 * activity/clothing recommendation via Gemini.
 *
 * @param {object} weather - { city, temperature, humidity, windSpeed, condition, feelsLike }
 * @param {object} [clientOverride] - optional pre-built client, used for testing
 *   without needing to intercept the dynamic import() machinery.
 */
const generateWeatherInsight = async (weather, clientOverride) => {
    const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return buildFallbackInsight(weather);
  }

  try {
    const ai = clientOverride || (await getGenAIClient());

    const prompt = `You are a helpful weather assistant. Given this current weather data:
City: ${weather.city}
Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
Humidity: ${weather.humidity}%
Wind speed: ${weather.windSpeed} m/s
Condition: ${weather.condition}

Write:
1. A short, natural-language summary of the weather (1-2 sentences).
2. A personalized recommendation covering suitable activities and clothing for these conditions (1-2 sentences).

Respond ONLY as JSON in this exact shape, with no markdown and no code fences:
{"summary": "...", "recommendation": "..."}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const text = (response.text || '').trim();
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      const err = new Error('AI service returned an unexpected response format');
      err.statusCode = 502;
      throw err;
    }

    if (!parsed.summary || !parsed.recommendation) {
      const err = new Error('AI service response was missing required fields');
      err.statusCode = 502;
      throw err;
    }

    return { summary: parsed.summary, recommendation: parsed.recommendation, fallback: false };
  } catch (error) {
  console.error('Gemini API error:', error);
  if (error.statusCode) throw error;

  const err = new Error(error.message || 'AI insight generation failed');
  err.statusCode = 502;
  throw err;
}
};

module.exports = { generateWeatherInsight, buildFallbackInsight };
