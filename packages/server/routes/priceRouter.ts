import axios from "axios";
import express, { Request, Response, NextFunction } from "express";

import redis from "../lib/redis";

const {
    COINGECKO = "https://api.coingecko.com/api/v3",
    CACHE_TTL = 15
} = process.env;

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
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
        next(error);
    }
});


export default router;