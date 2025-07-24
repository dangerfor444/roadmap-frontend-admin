
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Авторизация администратора
 *     tags: [Admin Admins]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Admin Roadmaps
 *     description: Управление роадмапами
 *   - name: Admin Ideas
 *     description: Управление идеями
 *   - name: Admin Votes
 *     description: Просмотр голосов
 *   - name: Admin Comments
 *     description: Модерация комментариев
 *   - name: Admin Tasks
 *     description: Управление задачами
 *   - name: Admin Admins
 *     description: Управление администраторами
 */

/**
 * @swagger
 * /admin/roadmaps:
 *   get:
 *     summary: Получить список всех роадмапов
 *     tags: [Admin Roadmaps]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Список роадмапов
 *   post:
 *     summary: Создать роадмап
 *     tags: [Admin Roadmaps]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               is_public:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Роадмап создан
 *
 * /admin/roadmaps/{id}:
 *   patch:
 *     summary: Обновить роадмап
 *     tags: [Admin Roadmaps]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               is_public:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Роадмап обновлен
 *   delete:
 *     summary: Удалить роадмап
 *     tags: [Admin Roadmaps]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Удалено успешно
 */

/**
 * @swagger
 * /admin/ideas:
 *   get:
 *     summary: Получить список идей
 *     tags: [Admin Ideas]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: state
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [visible, hidden, spam]
 *     responses:
 *       200:
 *         description: Список идей
 *
 * /admin/ideas/{id}:
 *   patch:
 *     summary: Обновить идею
 *     tags: [Admin Ideas]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               state:
 *                 type: string
 *                 enum: [visible, hidden, spam]
 *     responses:
 *       200:
 *         description: Идея обновлена
 *   delete:
 *     summary: Удалить идею
 *     tags: [Admin Ideas]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Удалено успешно
 */

/**
 * @swagger
 * /admin/ideas/{id}/votes:
 *   get:
 *     summary: Получить голоса за идею
 *     tags: [Admin Votes]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список голосов
 */

/**
 * @swagger
 * /admin/comments:
 *   get:
 *     summary: Получить комментарии
 *     tags: [Admin Comments]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: idea
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Комментарии получены
 *
 * /admin/comments/{id}:
 *   delete:
 *     summary: Удалить комментарий
 *     tags: [Admin Comments]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Удалено успешно
 */

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: Получить список задач
 *     tags: [Admin Tasks]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Список задач
 *
 * /admin/tasks/{id}:
 *   delete:
 *     summary: Удалить задачу
 *     tags: [Admin Tasks]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Удалено успешно
 */

/**
 * @swagger
 * /admin/admins:
 *   get:
 *     summary: Получить список админов
 *     tags: [Admin Admins]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Список админов
 *   post:
 *     summary: Добавить админа
 *     tags: [Admin Admins]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Админ добавлен
 *
 * /admin/admins/{id}:
 *   delete:
 *     summary: Удалить админа
 *     tags: [Admin Admins]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Удалено успешно
 *
 * /admin/admins/{id}/pass:
 *   patch:
 *     summary: Изменить пароль админа
 *     tags: [Admin Admins]
 *     security:
 *       - ApiKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       204:
 *         description: Пароль обновлён
 */