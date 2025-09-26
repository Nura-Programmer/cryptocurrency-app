import axios from "axios";
import express, { Request, Response } from "express";

import redis from "../lib/redis";

const {
    COINGECKO = "https://api.coingecko.com/api/v3",
    CACHE_TTL = 15
} = process.env;

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const coins = ((req.query.coins as string) || "bitcoin,ethereum")
        .split(",")
        .map((c) => c.trim().toLowerCase());
    const storedCoins: Record<string, any> = {};
    for (const coin of coins) {
        const item = await redis.get(`price:${coin}:usd`);
        storedCoins[coin] = item ? JSON.parse(item) : null;
    }
    res.json({ data: storedCoins });
});


export default router;