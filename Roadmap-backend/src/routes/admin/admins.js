import db from '../../db.js';
import bcrypt from 'bcrypt';

export async function listServices(req, res) {
  try {
    const { rows } = await db.query('SELECT id, name, slug, api_key FROM services ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}

export async function listAdmins(req, res) {
  const serviceId = req.service.id;
  const { rows } = await db.query(
    'SELECT id, email FROM admins WHERE service_id = $1',
    [serviceId]
  );
  res.json(rows);
}

export async function createAdmin(req, res) {
  const serviceId = req.service.id;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const { rows } = await db.query(
      'INSERT INTO admins (email, password_hash, service_id) VALUES ($1, $2, $3) RETURNING id, email',
      [email, hash, serviceId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Admin already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}

export async function deleteAdmin(req, res) {
  const serviceId = req.service.id;
  const id = req.params.id;

  const { rowCount } = await db.query(
    'DELETE FROM admins WHERE id = $1 AND service_id = $2',
    [id, serviceId]
  );

  if (rowCount === 0) {
    return res.status(404).json({ error: 'Admin not found' });
  }

  res.status(204).end();
}

export async function updateAdminPassword(req, res) {
  const serviceId = req.service.id;
  const id = req.params.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  const hash = await bcrypt.hash(password, 10);

  const { rowCount } = await db.query(
    'UPDATE admins SET password_hash = $1 WHERE id = $2 AND service_id = $3',
    [hash, id, serviceId]
  );

  if (rowCount === 0) {
    return res.status(404).json({ error: 'Admin not found' });
  }

  res.status(204).end();
}