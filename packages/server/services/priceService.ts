import axios from "axios";
import redis from "../lib/redis";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import { OPERATOR, PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const {
    COINGECKO = "https://api.coingecko.com/api/v3",
    CACHE_TTL = 15,
    POLL_INTERVAL = 60000, // 1 minute
    AXIOS_TIMEOUT = 5000,
} = process.env;

export function startPricePoller(io: SocketIOServer, coins: string[] = ["bitcoin", "ethereum"]) {
    async function fetchAndBroadcast() {
        try {
            const ids = coins.join(",");
            const url = `${COINGECKO}/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;
            const { data } = await axios.get(url, { timeout: +AXIOS_TIMEOUT });
            const ts = Date.now();

            for (const coin of Object.keys(data)) {
                const price = data[coin].usd;
                const key = `price:${coin}:usd`;

                await redis.set(key, JSON.stringify({ price, ts }), "EX", +CACHE_TTL);

                io.emit("price_update", { coin, price, ts });

                await evaluateAlerts(coin, price, ts, io);
            }
        } catch (err: any) {
            console.error("Poller error:", err.message);
        }
    }

    // run immediately, then at interval
    fetchAndBroadcast();
    const timer = setInterval(fetchAndBroadcast, +POLL_INTERVAL);
    return () => clearInterval(timer);
}

export async function evaluateAlerts(coin: string, price: number, ts: number, io: SocketIOServer) {
    const alerts = await prisma.alert.findMany({
        where: { coinId: coin, active: true },
    });

    for (const alert of alerts) {
        let match = false;

        if (alert.operator === OPERATOR.GREATER_THAN && price > alert.target) {
            match = true;
        }

        if (alert.operator === OPERATOR.LESS_THAN && price < alert.target) {
            match = true;
        }

        if (match) {
            await prisma.alert.update({
                where: { id: alert.id },
                data: { active: false, updatedAt: new Date(ts) },
            });

            io.emit("alert", {
                alertId: alert.id,
                coin,
                operator: alert.operator,
                target: alert.target,
                price,
                ts,
            });
        }
    }
};