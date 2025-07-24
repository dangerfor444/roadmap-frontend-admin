export async function listAllRoadmaps(req, res) {
    try {
      const serviceId = req.service.id;
  
      const { rows } = await req.db.query(
        `SELECT id, title, description, is_published, updated_at
         FROM roadmaps
         WHERE service_id = $1
         ORDER BY updated_at DESC`,
        [serviceId]
      );
  
      res.json({ roadmaps: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch roadmaps' });
    }
}

export async function createAdminRoadmap(req, res) {
    try {
      const serviceId = req.service.id;
      const { title, description } = req.body;
  
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
  
      const { rows } = await req.db.query(
        `INSERT INTO roadmaps (service_id, title, description, is_published)
         VALUES ($1, $2, $3, false)
         RETURNING *`,
        [serviceId, title, description || null]
      );
  
      res.status(201).json({ roadmap: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create roadmap' });
    }
}

export async function updateAdminRoadmap(req, res) {
    try {
      const serviceId = req.service.id;
      const { id } = req.params;
      const { title, description, is_published } = req.body;
  
      const { rows } = await req.db.query(
        `UPDATE roadmaps
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             is_published = COALESCE($3, is_published),
             updated_at = now()
         WHERE id = $4 AND service_id = $5
         RETURNING *`,
        [title, description, is_published, id, serviceId]
      );
  
      if (!rows.length) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }
  
      res.json({ roadmap: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update roadmap' });
    }
}

export async function deleteAdminRoadmap(req, res) {
    try {
      const serviceId = req.service.id;
      const { id } = req.params;
  
      const result = await req.db.query(
        'DELETE FROM roadmaps WHERE id = $1 AND service_id = $2 RETURNING *',
        [id, serviceId]
      );
  
      if (!result.rowCount) {
        return res.status(404).json({ error: 'Roadmap not found or not yours' });
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete roadmap' });
    }
}