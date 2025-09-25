import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const prices: string[] = [];

const PORT = process.env.PORT || 5000;
const COINGECKO = process.env.COINGECKO_BASE || "https://api.coingecko.com/api/v3";

app.get('/', (req: Request, res: Response) => {
    res.send('Hello cryptocurrency server!');
});

app.get("/api/prices", async (req, res) => {
    try {
        const coinsQuery = (req.query.coins as string) || "bitcoin,ethereum";
        const coins = coinsQuery.split(",").map((c) => c.trim().toLowerCase());

        const data: Record<string, any> = {};

        for (const coin of coins) {
            const priceExist = prices.includes(`price:${coin}:usd`);

            if (!priceExist) prices.push(`price:${coin}:usd`);

            const ids = coins.join(",");

            const url = `${COINGECKO}/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;
            const res = await axios.get(url, { timeout: 5000 });

            res.data && Object.assign(data, res.data); // e.g. { bitcoin: { usd: 26000 }, ethereum: { usd: 1700 } }
        }

        res.json({ data });
    } catch (error) {
        console.error("Error fetching prices:", error);
        res.status(500).json({ error: "Failed to fetch prices" });

    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});