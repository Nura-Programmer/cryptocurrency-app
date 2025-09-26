import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const {
    REDIS_PORT = 14989,
    REDIST_HOST = "redis-14989.c341.af-south-1-1.ec2.redns.redis-cloud.com",
    REDIS_PASSWORD = "redis_password",
    REDIS_DB = 0,
} = process.env;

const redis = new Redis({
    port: +REDIS_PORT, // use + for string to number conversion
    host: REDIST_HOST,
    username: "default",
    password: REDIS_PASSWORD,
    db: +REDIS_DB, // use + for string to number conversion
    tls: REDIS_PORT == 14989 ? undefined : {},
    maxRetriesPerRequest: null,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
