export async function listAllIdeas(req, res) {
  try {
    const serviceId = req.service.id;
    const { state } = req.query;

    // Собираем основу запроса
    let sql = `
      SELECT id, title, body, state, status, author_email, created_at
      FROM ideas
      WHERE service_id = $1
    `;
    const params = [serviceId];

    // Если передан state, добавляем фильтр
    if (state) {
      sql += ' AND state = $2';
      params.push(state);
    }

    // Сортировка
    sql += ' ORDER BY created_at DESC';

    // Выполняем
    const { rows } = await req.db.query(sql, params);
    res.json({ ideas: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
}

export async function updateIdeaState(req, res) {
  try {
    const serviceId = req.service.id;
    const { id }     = req.params;
    const { title, body, state, status } = req.body;

    const { rows } = await req.db.query(
      `UPDATE ideas
         SET title  = COALESCE($1, title),
             body   = COALESCE($2, body),
             state  = COALESCE($3, state),
             status = COALESCE($4, status)
       WHERE id = $5 AND service_id = $6
       RETURNING *`,
      [title, body, state, status, id, serviceId]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Idea not found or not yours' });
    }
    res.json({ idea: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update idea' });
  }
}

export async function deleteIdea(req, res) {
  try {
    const serviceId = req.service.id;
    const { id } = req.params;

    const { rowCount } = await req.db.query(
      `DELETE FROM ideas
       WHERE id = $1 AND service_id = $2`,
      [id, serviceId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Idea not found or not yours' });
    }

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
}