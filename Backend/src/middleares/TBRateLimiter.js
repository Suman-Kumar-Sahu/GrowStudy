const buckets = new Map();

const MAX_TOKENS = 10;
const REFILL_RATE = 1;

export const tokenBucket = (req, res, next) => {
    const clientId = req.ip;
    const now = Date.now();

    let bucket = buckets.get(clientId);

    if (!bucket) {
        bucket = {
            tokens: MAX_TOKENS,
            lastRefill: now
        };
    }

    const elapsed = (now - bucket.lastRefill) / 1000;

    if (elapsed >= 1) {
        bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + elapsed * REFILL_RATE);
        bucket.lastRefill = now;
    }

    if (bucket.tokens < 1) {
        return res.status(429).json({ message: "Rate limit exceeded." })
    }

    bucket.tokens -= 1;
    buckets.set(clientId, bucket);

    console.log({
        ip: clientId,
        tokensRemaining: bucket.tokens.toFixed(2),
        lastRefill: new Date(bucket.lastRefill).toLocaleTimeString()
    });

    next();

}