export async function listAdminComments(req, res) {
    try {
      const serviceId = req.service.id;
      const ideaId = req.query.idea;
  
      if (!ideaId) {
        return res.status(400).json({ error: 'Missing idea query param' });
      }
  
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
  
  export async function deleteComment(req, res) {
    try {
      const serviceId = req.service.id;
      const { id } = req.params;
  
      const { rowCount } = await req.db.query(
        `DELETE FROM comments
         WHERE id = $1 AND idea_id IN (
           SELECT id FROM ideas WHERE service_id = $2
         )`,
        [id, serviceId]
      );
  
      if (!rowCount) {
        return res.status(404).json({ error: 'Comment not found or not yours' });
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  }