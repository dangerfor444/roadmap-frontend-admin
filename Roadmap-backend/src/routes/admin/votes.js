export async function listVotesForIdea(req, res) {
    try {
      const serviceId = req.service.id;
      const { id: ideaId } = req.params;
  
      // Убедимся, что идея принадлежит этому сервису
      const { rowCount } = await req.db.query(
        'SELECT 1 FROM ideas WHERE id = $1 AND service_id = $2',
        [ideaId, serviceId]
      );
      if (!rowCount) {
        return res.status(404).json({ error: 'Idea not found' });
      }
  
      const { rows } = await req.db.query(
        `SELECT id, reaction, voter_ip, created_at
         FROM votes
         WHERE idea_id = $1
         ORDER BY created_at ASC`,
        [ideaId]
      );
  
      res.json({ votes: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch votes' });
    }
}