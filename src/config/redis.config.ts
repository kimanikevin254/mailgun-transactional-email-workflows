import IORedis from 'ioredis';

export const redisConfig = new IORedis({ 
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
});