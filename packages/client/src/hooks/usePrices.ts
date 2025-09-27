import { useEffect, useState } from "react";
import socket from "./socket";

type PriceData = {
    [coin: string]: { price: number; ts: number };
};

export function usePrices() {
    const [prices, setPrices] = useState<PriceData>({});

    useEffect(() => {
        socket.on("price_update", (data: { coin: string; price: number; ts: number }) => {
            setPrices((prev) => ({ ...prev, [data.coin]: { price: data.price, ts: data.ts } }));
        });

        return () => {
            socket.off("price_update");
        };
    }, []);

    return prices;
}
