import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json({ limit: '15mb' }));

const distPath = path.resolve(__dirname, 'dist');
const hasBuiltAssets = fs.existsSync(path.resolve(distPath, 'index.html'));

if (hasBuiltAssets) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('*', (_req, res) => {
    res.send(`
      <h1>App not built yet</h1>
      <p>Run: npm install && npm run build</p>
    `);
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
