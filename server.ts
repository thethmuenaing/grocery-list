import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Translation using Gemini API
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, note, currentLang } = req.body;

      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Text parameter is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Handle missing key gracefully with fallback instruction
        return res.json({
          success: false,
          reason: 'No Gemini API key available',
          fallback: {
            name: {
              en: currentLang === 'en' ? text : text,
              my: currentLang === 'my' ? text : text,
            },
            note: note
              ? {
                  en: currentLang === 'en' ? note : note,
                  my: currentLang === 'my' ? note : note,
                }
              : undefined,
          },
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are an expert bilingual English and Myanmar (Burmese) translator for a grocery shopping application.
Translate the grocery item name and optional note provided below so both English ("en") and Myanmar ("my") versions are accurate, natural, and helpful for grocery shopping.

Item Name: "${text}"
Optional Note: "${note || ''}"
User Current Language Context: "${currentLang || 'en'}"

Rules:
1. If Item Name is in English (e.g. "Pork", "Rice", "Milk"), translate it accurately to Myanmar (e.g. "ဝက်သား", "ဆန်", "နို့").
2. If Item Name is in Myanmar (e.g. "ဝက်သား", "ဆန်"), translate it accurately to English (e.g. "Pork", "Rice").
3. Preserve specific quantities or measurements (e.g. "2 kg" -> "၂ ကီလို" or "2 kg").
4. Translate the Optional Note if provided; otherwise return empty string for note.

Return JSON in this format:
{
  "name": {
    "en": "English name",
    "my": "Myanmar name"
  },
  "note": {
    "en": "English note or empty string",
    "my": "Myanmar note or empty string"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  my: { type: Type.STRING },
                },
                required: ['en', 'my'],
              },
              note: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  my: { type: Type.STRING },
                },
                required: ['en', 'my'],
              },
            },
            required: ['name'],
          },
        },
      });

      const rawText = response.text || '';
      const parsed = JSON.parse(rawText);

      return res.json({
        success: true,
        data: {
          name: {
            en: parsed?.name?.en || text,
            my: parsed?.name?.my || text,
          },
          note: note
            ? {
                en: parsed?.note?.en || note,
                my: parsed?.note?.my || note,
              }
            : undefined,
        },
      });
    } catch (error) {
      console.error('Translation server error:', error);
      const text = req.body?.text || '';
      const note = req.body?.note;
      return res.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {
          name: { en: text, my: text },
          note: note ? { en: note, my: note } : undefined,
        },
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Grocery App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
