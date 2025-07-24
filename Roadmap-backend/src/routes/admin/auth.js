import db from '../../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function adminLogin(req, res) {
  const { email, password } = req.body;
  const serviceId = req.service?.id;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const { rows } = await db.query(
      'SELECT * FROM admins WHERE email = $1 AND service_id = $2',
      [email, serviceId]
    );

    const admin = rows[0];
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin.id, serviceId }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}