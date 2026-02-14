const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Convert a File to base64 data URL
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
};

const SOIL_ANALYSIS_PROMPT = `You are an agricultural soil analysis expert. Analyze this soil test report image.

1. First, perform OCR to extract all text and values from the report.
2. Then analyze the soil health based on extracted data.

Return your response as a valid JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):
{
    "rawText": "The full OCR-extracted text from the report",
    "values": {
        "nitrogen": "value with unit or 'Not found'",
        "phosphorus": "value with unit or 'Not found'",
        "potassium": "value with unit or 'Not found'",
        "pH": "value or 'Not found'",
        "electricalConductivity": "value with unit or 'Not found'",
        "organicCarbon": "value or 'Not found'",
        "iron": "value or 'Not found'",
        "zinc": "value or 'Not found'",
        "manganese": "value or 'Not found'",
        "copper": "value or 'Not found'",
        "boron": "value or 'Not found'"
    },
    "overallStatus": "Good / Moderate / Poor",
    "deficiencies": ["list of nutrient deficiencies found"],
    "summary": "2-3 sentence summary of soil health",
    "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3", "actionable suggestion 4"]
}

If this is not a soil test report, return:
{ "error": "This does not appear to be a soil test report", "rawText": "extracted text" }`;

/**
 * Analyze a soil test report image using OpenRouter (Google Gemini 2.0 Flash).
 * Performs OCR + analysis in a single API call.
 * @param {File} file - The uploaded file (image)
 * @returns {Object} - Structured soil analysis result
 */
export const analyzeSoilReport = async (file) => {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured. Add VITE_OPENROUTER_API_KEY to .env');
    }

    const base64DataUrl = await fileToBase64(file);

    const requestBody = {
        model: 'google/gemini-2.0-flash-001',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: base64DataUrl
                        }
                    },
                    {
                        type: 'text',
                        text: SOIL_ANALYSIS_PROMPT
                    }
                ]
            }
        ],
        temperature: 0.2,
        top_p: 0.8,
        max_tokens: 2048
    };

    console.log('[SoilAnalysis] Sending request to OpenRouter...');

    const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'CoFarm Soil Analysis'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error?.message || errData.error?.code || `API error: ${response.status}`;
        console.error('[SoilAnalysis] API error:', errData);
        throw new Error(errMsg);
    }

    const data = await response.json();
    console.log('[SoilAnalysis] Response received');

    const textContent = data.choices?.[0]?.message?.content;

    if (!textContent) {
        throw new Error('No response from AI model');
    }

    // Parse JSON from response (strip markdown code fences if present)
    const cleanJson = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try {
        return JSON.parse(cleanJson);
    } catch {
        console.error('Failed to parse AI response:', textContent);
        return {
            rawText: textContent,
            values: {},
            overallStatus: 'Unknown',
            deficiencies: [],
            summary: textContent.substring(0, 200),
            suggestions: ['Unable to parse structured data. Please review the raw text above.']
        };
    }
};
