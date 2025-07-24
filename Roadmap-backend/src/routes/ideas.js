export async function createIdeaHandler(req, res) {
  try {
    const { title, body: content, author_email } = req.body;
    const serviceId = req.service.id;

    if (!title || !content) {
      return res.status(400).json({ error: 'Missing title or body' });
    }

    const { rows } = await req.db.query(
      `INSERT INTO ideas (service_id, title, "body", author_email, state)
       VALUES ($1, $2, $3, $4, 'visible')
       RETURNING id, title, "body" AS body, state, status`,
      [serviceId, title, content, author_email || null]
    );

    res.status(201).json({ idea: rows[0] });
  } catch (err) {
    console.error('Error in createIdeaHandler:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function listIdeas(req, res) {
  try {
    const serviceId = req.service.id;
    const { rows } = await req.db.query(
      `SELECT
         id,
         title,
         "body" AS body,
         state,
         status,
         author_email,
         created_at
       FROM ideas
       WHERE service_id = $1
         AND state = 'visible'
       ORDER BY created_at DESC`,
      [serviceId]
    );
    res.json({ ideas: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
}