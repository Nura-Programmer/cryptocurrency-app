import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import http from 'http';
import type { Request, Response } from 'express';
import redis from './lib/redis.ts';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const prices: string[] = [];

const {
    PORT = 5000,
    COINGECKO = "https://api.coingecko.com/api/v3",
    CACHE_TTL = 15
} = process.env;


app.get('/', (req: Request, res: Response) => {
    res.send('Hello cryptocurrency server!');
});

app.get("/api/prices", async (req, res) => {
    try {
        const coinsQuery = (req.query.coins as string) || "bitcoin,ethereum";
        const coins = coinsQuery.split(",").map((c) => c.trim().toLowerCase());

        const ids = coins.join(",");
        const url = `${COINGECKO}/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;
        const { data } = await axios.get(url, { timeout: 5000 });
        const ts = Date.now();

        for (const coin of Object.keys(data)) {
            const price = data[coin].usd;
            const key = `price:${coin}:usd`;

            await redis.set(key, JSON.stringify({ price, ts }), "EX", +CACHE_TTL);
        }

        res.json({ data });
    } catch (error) {
        console.error("Error fetching prices:", error);
        res.status(500).json({ error: "Failed to fetch prices" });

    }
});

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});