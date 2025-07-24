export async function getWidgetData(req, res) {
  try {
    const { slug } = req.params;
    const serviceRes = await req.db.query(
      'SELECT id FROM services WHERE slug = $1',
      [slug]
    );
    if (!serviceRes.rowCount) {
      return res.status(404).json({ error: 'Service not found' });
    }
    const serviceId = serviceRes.rows[0].id;

    const [roadmaps, ideas] = await Promise.all([
      req.db.query(
        `SELECT id, title, description, updated_at
         FROM roadmaps
         WHERE service_id = $1 AND is_published = true`,
        [serviceId]
      ),
      req.db.query(
        `SELECT i.id, i.title, i.body, i.status, i.created_at,
                COALESCE(
                  json_agg(v.reaction) FILTER (WHERE v.reaction IS NOT NULL),
                  '[]'
                ) AS reactions
         FROM ideas i
         LEFT JOIN votes v ON v.idea_id = i.id
         WHERE i.service_id = $1 AND i.state = 'visible'
         GROUP BY i.id`,
        [serviceId]
      ),
    ]);

    res.set('Cache-Control', 'public, max-age=60');
    res.json({ roadmaps: roadmaps.rows, ideas: ideas.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load widget data' });
  }
}