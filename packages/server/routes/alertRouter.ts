import express from "express";

import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        const { coinId, operator, target, currency = "usd" } = req.body;

        const alert = await prisma.alert.create({
            data: {
                coinId: coinId.toLowerCase(),
                currency: currency.toLowerCase(),
                operator,
                target,
            },
        });

        res.status(201).json({ data: alert })
    } catch (err) {
        next(err);
    }
});

export default router;