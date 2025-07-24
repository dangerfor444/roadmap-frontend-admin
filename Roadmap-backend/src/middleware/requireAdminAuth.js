import jwt from 'jsonwebtoken';

export function requireAdminAuth(req, res, next) {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = header.slice(7); // remove "Bearer "
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.serviceId !== req.service?.id) {
      return res.status(403).json({ error: 'Invalid token for this service' });
    }

    req.admin = { id: payload.adminId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}