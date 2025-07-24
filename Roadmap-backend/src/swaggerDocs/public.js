/**
 * @swagger
 * tags:
 *   - name: Ideas
 *     description: Работа с идеями
 *   - name: Roadmaps
 *     description: Работа с роадмапами
 */

/**
 * @swagger
 * /ideas:
 *   post:
 *     summary: Создать идею
 *     tags: [Ideas]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, body]
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               author_email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Идея создана
 *       400:
 *         description: Ошибка валидации
 */

/**
 * @swagger
 * /roadmaps:
 *   get:
 *     summary: Получить список роадмапов
 *     tags: [Roadmaps]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Список роадмапов
 *   post:
 *     summary: Создать роадмап
 *     tags: [Roadmaps]
 *     security:
 *       - ApiKeyAuth: []
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
 *     responses:
 *       201:
 *         description: Роадмап создан
 *
 * /roadmaps/{id}:
 *   patch:
 *     summary: Обновить роадмап
 *     tags: [Roadmaps]
 *     security:
 *       - ApiKeyAuth: []
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
 *               is_published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Роадмап обновлён
 *       404:
 *         description: Не найден
 */ 

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Работа с задачами
 *   - name: Comments
 *     description: Работа с комментариями
 *   - name: Votes
 *     description: Голосование за идеи
 *   - name: Widget
 *     description: Публичные данные для отображения
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Получить список задач
 *     tags: [Tasks]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Список задач
 *   post:
 *     summary: Создать задачу
 *     tags: [Tasks]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roadmap_id, title]
 *             properties:
 *               roadmap_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Задача создана
 *
 * /tasks/{id}:
 *   patch:
 *     summary: Обновить задачу
 *     tags: [Tasks]
 *     security:
 *       - ApiKeyAuth: []
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Задача обновлена
 *       404:
 *         description: Не найдена
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Получить комментарии к идее
 *     tags: [Comments]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: idea
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список комментариев
 *       400:
 *         description: Не указана идея
 *
 *   post:
 *     summary: Добавить комментарий
 *     tags: [Comments]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idea_id, body]
 *             properties:
 *               idea_id:
 *                 type: integer
 *               body:
 *                 type: string
 *               author_email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Комментарий добавлен
 *       400:
 *         description: Ошибка валидации
 */

/**
 * @swagger
 * /votes:
 *   post:
 *     summary: Проголосовать за идею
 *     tags: [Votes]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idea_id, reaction]
 *             properties:
 *               idea_id:
 *                 type: integer
 *               reaction:
 *                 type: string
 *                 enum: [like, dislike]
 *     responses:
 *       201:
 *         description: Голос принят или обновлён
 *       404:
 *         description: Идея не найдена
 */

/**
 * @swagger
 * /widget/{slug}:
 *   get:
 *     summary: Получить данные для виджета
 *     tags: [Widget]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Публичные данные сервиса
 *       404:
 *         description: Сервис не найден
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Проверка доступности сервера
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Сервер работает
 */