import { randomUUID } from 'crypto';
import db from '../src/db.js';

const name   = 'My Second Service';
const slug   = 'new-slug';
const apiKey = randomUUID();

const sql = `
  INSERT INTO services (name, slug, api_key)
  VALUES ($1, $2, $3)
  RETURNING id, slug, api_key;
`;

try {
  const { rows } = await db.query(sql, [name, slug, apiKey]);
  console.log('✅ Service created:', rows[0]);
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}