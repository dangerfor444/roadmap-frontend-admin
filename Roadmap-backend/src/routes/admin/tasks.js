export async function listAdminTasks(req, res) {
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
  
export async function deleteTask(req, res) {
    try {
      const serviceId = req.service.id;
      const { id } = req.params;
  
      const result = await req.db.query(
        `DELETE FROM tasks
         WHERE id = $1 AND service_id = $2
         RETURNING *`,
        [id, serviceId]
      );
  
      if (!result.rowCount) {
        return res.status(404).json({ error: 'Task not found or not yours' });
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete task' });
    }
}