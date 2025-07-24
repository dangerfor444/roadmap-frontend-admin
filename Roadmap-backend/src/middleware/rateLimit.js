const buckets = new Map(); 

export function rateLimit(limit = 10, windowMs = 60_000) {
  return (req, res, next) => {
    const key = `${req.service.id}:${req.ip}`;
    const now = Date.now();

    const entry = buckets.get(key) || { count: 0, last: now };
    if (now - entry.last > windowMs) {
      entry.count = 0;
      entry.last = now;
    }

    entry.count += 1;
    buckets.set(key, entry);

    if (entry.count > limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    next();
  };
}