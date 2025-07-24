export async function listTasks(req, res) {
    try {
      const serviceId = req.service.id;
      const { rows } = await req.db.query(
        `SELECT id, roadmap_id, title, body, status, updated_at
         FROM tasks
         WHERE service_id = $1
         ORDER BY updated_at DESC`,
        [serviceId]
      );
      res.json({ tasks: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }
  
  export async function createTask(req, res) {
    try {
      const serviceId = req.service.id;
      const { roadmap_id, title, body } = req.body;
      if (!roadmap_id || !title) {
        return res.status(400).json({ error: 'Missing roadmap_id or title' });
      }
  
      // Проверяем, принадлежит ли roadmap текущему сервису
      const check = await req.db.query(
        'SELECT id FROM roadmaps WHERE id = $1 AND service_id = $2',
        [roadmap_id, serviceId]
      );
      if (!check.rowCount) {
        return res.status(403).json({ error: 'Invalid roadmap_id' });
      }
  
      const { rows } = await req.db.query(
        `INSERT INTO tasks (service_id, roadmap_id, title, body)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [serviceId, roadmap_id, title, body || null]
      );
      res.status(201).json({ task: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
  
  export async function updateTask(req, res) {
    try {
      const serviceId = req.service.id;
      const { id } = req.params;
      const { title, body, status } = req.body;
  
      const { rows } = await req.db.query(
        `UPDATE tasks SET
           title = COALESCE($1, title),
           body = COALESCE($2, body),
           status = COALESCE($3, status),
           updated_at = now()
         WHERE id = $4 AND service_id = $5
         RETURNING *`,
        [title, body, status, id, serviceId]
      );
  
      if (!rows.length) return res.status(404).json({ error: 'Task not found' });
      res.json({ task: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }