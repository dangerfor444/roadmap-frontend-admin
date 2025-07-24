export async function createVote(req, res) {
    try {
      const { idea_id, reaction } = req.body;
      const serviceId = req.service.id;
      const ip = req.ip;
  
      if (!idea_id || !reaction) {
        return res.status(400).json({ error: 'Missing idea_id or reaction' });
      }
  
      // Проверим, что идея принадлежит текущему сервису
      const idea = await req.db.query(
        'SELECT id FROM ideas WHERE id = $1 AND service_id = $2',
        [idea_id, serviceId]
      );
      if (!idea.rowCount) {
        return res.status(404).json({ error: 'Idea not found' });
      }
  
      // Вставка или обновление голоса
      const { rows } = await req.db.query(
        `INSERT INTO votes (idea_id, voter_ip, reaction)
         VALUES ($1, $2, $3)
         ON CONFLICT (idea_id, voter_ip)
         DO UPDATE SET reaction = EXCLUDED.reaction
         RETURNING *`,
        [idea_id, ip, reaction]
      );
  
      res.status(201).json({ vote: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit vote' });
    }
  }