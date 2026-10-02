import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const requestedPort = Number(process.env.PORT ?? 3000);

function listenOnPort(port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(port);
    });

    server.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        resolve(listenOnPort(port + 1));
        return;
      }

      reject(error);
    });
  });
}

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback romantic English poetry library
const romanticPoems = [
  {
    title: "The Constellation in Your Eyes",
    poetryLines: "In a world that rushes past the delicate things,\nyou are the stillness where the morning sings.\nEvery color turns softer where your footsteps tread,\nand silence becomes poetry with words unsaid.",
    meaning: "A tribute to her gentle grace and serene warmth.",
    mood: "romantic"
  },
  {
    title: "Starlight Whispers",
    poetryLines: "If stars could fall and choose where they might sleep,\nthey would rest within the kindness that you keep.\nYou don't just hold beauty; you give it away,\nlike golden light at the break of day.",
    meaning: "A reflection on her boundless warmth and inner luminescence.",
    mood: "deep"
  },
  {
    title: "Sakura in the Wind",
    poetryLines: "You are the gentle petal that refuses to fall,\nthe quiet wonder that outshines them all.\nWhen shadows gather and the evening grows dim,\nyour radiant laugh becomes my favorite hymn.",
    meaning: "How her presence brings solace and joy to any evening.",
    mood: "sweet"
  },
  {
    title: "Eternal Resonance",
    poetryLines: "Between every heartbeat and every sigh,\nyou are the reason the heavens paint the sky.\nNo verse in all the centuries of art\ncould ever match the music of your heart.",
    meaning: "A timeless love tribute to someone completely irreplaceable.",
    mood: "romantic"
  },
  {
    title: "Happy Birthday Blessing",
    poetryLines: "May this blessed birthday bring endless sunshine your way,\nwith flowers in full bloom to celebrate your day!\nMay all your dearest dreams unfold in golden grace,\nand joy forever write its smile upon your radiant face.",
    meaning: "A heartfelt birthday blessing composed exclusively for her special day.",
    mood: "birthday"
  }
];

// Fallback Anime/Image Descriptions
const animeImageFallbacks = [
  {
    poeticDescription: "A breath of sakura petals suspended in twilight hues—where the wind carries whispers of a parallel dream. The soft glow of sunset highlights every stroke, invoking the nostalgic warmth of a Makoto Shinkai sky where two souls are destined to meet.",
    animeVibe: "Makoto Shinkai Sunset Reverie · Ethereal Twilight",
    whisper: "Where the sky and petals meet your heartbeat.",
    colorPalette: ["#FECDD3", "#E9D5FF", "#FEF08A", "#67E8F9"],
    englishPoem: "Soft as cherry blossom breath, wild as twilight gold,\na thousand galaxies of grace waiting to unfold."
  },
  {
    poeticDescription: "Gentle luminescence dancing across starlit shores. In the quiet universe of this frame, time pauses to marvel at the innocence and wonder captured—an anime romance frozen at the exact second before a miracle unfolds.",
    animeVibe: "Studio Ghibli Starry Meadow · Whimsical Peace",
    whisper: "Starlight woven into quiet grace.",
    colorPalette: ["#A7F3D0", "#BAE6FD", "#FDE68A", "#DDD6FE"],
    englishPoem: "If skies could speak of the stars they love the best,\nthey would lay their tender light upon your chest."
  }
];

// AI Image Description Endpoint
app.post('/api/describe-image', async (req, res) => {
  const { imageBase64, imageUrl, title, vibe, userName } = req.body;

  if (ai) {
    try {
      const promptText = `You are a romantic anime art connoisseur and poetic visionary.
Describe this image in the most romantic, poetic, and heartwarming English words possible to impress a girl named "${userName || 'Beloved Muse'}".
Image Title / Context: "${title || 'Anime Ethereal Scene'}"
Vibe: "${vibe || 'Romantic, dreamy, anime aesthetic'}"

Return ONLY a valid JSON object strictly matching this schema:
{
  "poeticDescription": "A lush 2-3 sentence description in English capturing the anime atmosphere, soft colors, emotional depth, and romantic feel",
  "animeVibe": "e.g. Makoto Shinkai Twilight Reverie / Ghibli Golden Meadow",
  "whisper": "a delicate 4-8 word poetic whisper in English",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "englishPoem": "A beautiful 2-line or 4-line English romantic poem with rhythm and rhyme crafted for audio recitation"
}`;

      let contents: any = promptText;

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        contents = {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: 'image/jpeg'
              }
            },
            { text: promptText }
          ]
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.85
        }
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText.trim());
          return res.json({ success: true, ...parsed });
        } catch {
          // fallback
        }
      }
    } catch (err: any) {
      console.warn('Gemini image description error, using curated fallback:', err?.message);
    }
  }

  const fallback = animeImageFallbacks[Math.floor(Math.random() * animeImageFallbacks.length)];
  return res.json({ success: true, ...fallback });
});

// AI English Romantic Poetry Generation Endpoint
app.post('/api/generate-shayari', async (req, res) => {
  const { name, mood } = req.body;

  if (ai) {
    try {
      const promptText = `You are a renowned romantic poet who crafts exquisite English romantic poetry.
Write a heartfelt, romantic English poem dedicated to "${name || 'beautiful soul'}".
The poetry must be purely in English, with musical rhythm and emotional rhyme, designed to be read aloud with audio.
Topic/Mood requested: ${mood || 'romantic appreciation'}.

Return ONLY a valid JSON object strictly matching this schema:
{
  "title": "A short poetic title for this poem",
  "poetryLines": "a 4-line heartfelt English romantic poem with rhyme (formatted with newlines)",
  "meaning": "a 1-sentence English romantic sentiment / meaning behind the poem",
  "mood": "${mood || 'romantic'}"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.9
        }
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText.trim());
          return res.json({
            success: true,
            title: parsed.title,
            poetryLines: parsed.poetryLines,
            meaning: parsed.meaning,
            mood: parsed.mood || mood || 'romantic',
            // backward compat keys if frontend reads them
            shayariText: parsed.poetryLines,
            translation: parsed.meaning,
          });
        } catch {
          // fallback
        }
      }
    } catch (err: any) {
      console.warn('Gemini poetry error, using curated fallback:', err?.message);
    }
  }

  const picked = romanticPoems[Math.floor(Math.random() * romanticPoems.length)];
  return res.json({
    success: true,
    title: picked.title,
    poetryLines: picked.poetryLines,
    meaning: picked.meaning,
    mood: picked.mood,
    shayariText: picked.poetryLines,
    translation: picked.meaning,
  });
});


async function startServer() {
  const port = await listenOnPort(requestedPort);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: process.env.DISABLE_HMR === 'true' ? undefined : {
          port: Number(process.env.VITE_HMR_PORT ?? 24679),
          host: 'localhost',
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  if (port !== requestedPort) {
    console.log(`Port ${requestedPort} was busy; using ${port}.`);
  }
  console.log(`Open the app: http://localhost:${port}`);
}

startServer();
