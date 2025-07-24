import db from '../db.js';

export async function apiKey(req, res, next) {
  const key = req.header('x-api-key');
  if (!key) return res.status(401).json({ error: 'API key missing' });

  try {
    const { rows } = await db.query(
      'SELECT * FROM services WHERE api_key = $1',
      [key]
    );
    if (!rows.length) return res.status(403).json({ error: 'Invalid API key' });

    req.service = rows[0]; 
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}