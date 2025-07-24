import db from '../src/db.js';
import { randomUUID } from 'crypto';

const [,, slug, ...nameParts] = process.argv;
const name = nameParts.join(' ');

if (!slug || !name) {
  console.error('Usage: node scripts/create_service.js <slug> <Name of Service>');
  process.exit(1);
}

const apiKey = randomUUID();

try {
  const { rows } = await db.query(
    `INSERT INTO services (name, slug, api_key)
     VALUES ($1, $2, $3)
     RETURNING id, name, slug, api_key;`,
    [name, slug, apiKey]
  );

  console.log('✅ Service created:');
  console.table(rows);
} catch (err) {
  if (err.code === '23505') {
    console.error('❌ Slug or API key already exists. Try a different slug.');
  } else {
    console.error('❌ Failed to create service:', err);
  }
  process.exit(1);
}