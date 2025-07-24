export async function listComments(req, res) {
  try {
    const ideaId = req.query.idea;
    const serviceId = req.service.id;

    if (!ideaId) {
      return res.status(400).json({ error: 'Missing idea query param' });
    }

    // Проверяем, что идея принадлежит этому сервису
    const { rowCount } = await req.db.query(
      'SELECT 1 FROM ideas WHERE id = $1 AND service_id = $2',
      [ideaId, serviceId]
    );
    if (!rowCount) {
      return res.status(403).json({ error: 'Idea not found' });
    }

    const { rows } = await req.db.query(
      `SELECT id, body, author_email, created_at
       FROM comments
       WHERE idea_id = $1
       ORDER BY created_at ASC`,
      [ideaId]
    );

    res.json({ comments: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}

export async function createComment(req, res) {
  try {
    const serviceId = req.service.id;
    const { idea_id, body, author_email } = req.body;

    if (!idea_id || !body) {
      return res.status(400).json({ error: 'Missing idea_id or body' });
    }

    // Проверяем, что идея принадлежит этому сервису
    const { rowCount } = await req.db.query(
      'SELECT 1 FROM ideas WHERE id = $1 AND service_id = $2',
      [idea_id, serviceId]
    );
    if (!rowCount) {
      return res.status(403).json({ error: 'Idea not found' });
    }

    const { rows } = await req.db.query(
      `INSERT INTO comments (idea_id, body, author_email)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [idea_id, body, author_email || null]
    );

    res.status(201).json({ comment: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
}