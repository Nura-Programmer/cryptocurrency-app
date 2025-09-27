import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import priceRouter from './routes/priceRouter';
import alertRouter from "./routes/alertRouter";
import { startPricePoller } from './services/priceService';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const {
    PORT = 5000,
} = process.env;

app.use("/api/prices", priceRouter);
app.use("/api/alerts", alertRouter);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello cryptocurrency server!');
});

const server = http.createServer(app);

const io = new SocketIOServer(server, {
    cors: { origin: "*" },
    path: "/socket.io"
});

io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startPricePoller(io, ["bitcoin", "ethereum"]);
});