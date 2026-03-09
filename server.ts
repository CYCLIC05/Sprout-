import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("sprout.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS watchlist (
    id TEXT PRIMARY KEY,
    type TEXT,
    name TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    type TEXT,
    name TEXT,
    price REAL,
    change_24h REAL,
    volume_24h REAL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock data generator for TON assets
  const getMockAssets = () => [
    { id: 'u1', type: 'username', name: 'sprout.ton', price: 1250, change_24h: 5.2, volume_24h: 45000 },
    { id: 'u2', type: 'username', name: 'crypto.ton', price: 8900, change_24h: -1.5, volume_24h: 120000 },
    { id: 'n1', type: 'nft', name: 'TON Punks #442', price: 450, change_24h: 12.8, volume_24h: 15000 },
    { id: 'n2', type: 'nft', name: 'Mutant TON #12', price: 320, change_24h: 2.1, volume_24h: 8000 },
    { id: 'g1', type: 'gift', name: 'Diamond Heart', price: 45, change_24h: 0.5, volume_24h: 2000 },
    { id: 's1', type: 'sticker', name: 'Pepe TON Pack', price: 12, change_24h: 25.4, volume_24h: 5000 },
  ];

  // API Routes
  app.get("/api/trending", (req, res) => {
    res.json(getMockAssets().sort((a, b) => b.change_24h - a.change_24h));
  });

  app.get("/api/assets", (req, res) => {
    res.json(getMockAssets());
  });

  app.get("/api/market-stats", (req, res) => {
    res.json({
      marketCap: "1.2B TON",
      volume24h: "42,300 TON",
      totalSales: 1204,
      activeTraders: 856
    });
  });

  app.get("/api/recent-sales", (req, res) => {
    res.json([
      { id: 's1', assetName: 'crypto.ton', price: 8900, time: '2m ago' },
      { id: 's2', assetName: 'TON Punk #442', price: 450, time: '5m ago' },
      { id: 's3', assetName: 'Golden Gift', price: 120, time: '12m ago' },
      { id: 's4', assetName: 'sprout.ton', price: 1250, time: '15m ago' },
      { id: 's5', assetName: 'Diamond Heart', price: 45, time: '22m ago' },
    ]);
  });

  app.get("/api/watchlist", (req, res) => {
    const items = db.prepare("SELECT * FROM watchlist").all();
    res.json(items);
  });

  app.post("/api/watchlist", (req, res) => {
    const { id, type, name } = req.body;
    try {
      db.prepare("INSERT INTO watchlist (id, type, name) VALUES (?, ?, ?)").run(id, type, name);
      res.status(201).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Already in watchlist" });
    }
  });

  app.delete("/api/watchlist/:id", (req, res) => {
    db.prepare("DELETE FROM watchlist WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sprout server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
