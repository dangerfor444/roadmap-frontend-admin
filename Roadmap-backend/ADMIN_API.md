

# 🛠️ Roadmap Hub — Admin API

Все маршруты ниже требуют:

- Заголовок `x-api-key`: уникальный ключ сервиса
- Заголовок `Authorization: Bearer <admin_token>`

---

## 📌 Роадмапы

### `GET /admin/roadmaps`
Получить список всех роадмапов сервиса.

**Ответ**
```json
{ "roadmaps": [ { "id": 1, "title": "...", "description": "...", "is_public": true } ] }
```

---

### `POST /admin/roadmaps`
Создать новый роадмап.

**Тело запроса**
```json
{ "title": "Название", "description": "Описание", "is_public": true }
```

**Ответ**
```json
{ "id": ..., "title": "...", ... }
```

---

### `PATCH /admin/roadmaps/:id`
Обновить роадмап.

**Тело запроса**
```json
{ "title": "...", "description": "...", "is_public": true }
```

---

### `DELETE /admin/roadmaps/:id`
Удалить роадмап.

---

## 💡 Идеи

### `GET /admin/ideas?state=`
Получить идеи сервиса.

**Параметры**
- `state` (опционально): `visible`, `hidden`, `spam`

---

### `PATCH /admin/ideas/:id`
Обновить идею.

**Тело запроса**
```json
{ "title": "...", "body": "...", "state": "visible|hidden|spam" }
```

---

### `DELETE /admin/ideas/:id`
Удалить идею.

---

## ❤️ Голоса

### `GET /admin/ideas/:id/votes`
Получить все голоса за идею.

**Ответ**
```json
{ "votes": [ { "id": 1, "reaction": "👍", "voter_ip": "...", "created_at": "..." } ] }
```

---

## 💬 Комментарии

### `GET /admin/comments?idea=ID`
Получить комментарии к идее.

**Параметры**
- `idea` (обязательный): ID идеи

---

### `DELETE /admin/comments/:id`
Удалить комментарий.

---

## ✅ Задачи

### `GET /admin/tasks`
Получить список всех задач текущего сервиса.

---

### `DELETE /admin/tasks/:id`
Удалить задачу.

---

## 👥 Администраторы

### `GET /admin/admins`
Получить список администраторов текущего сервиса.

**Ответ**
```json
[
  { "id": 1, "email": "admin@example.com" },
  { "id": 2, "email": "another@example.com" }
]
```

---

### `POST /admin/admins`
Создать нового администратора.

**Тело запроса**
```json
{ "email": "newadmin@example.com", "password": "secret123" }
```

**Ответ**
```json
{ "id": 3, "email": "newadmin@example.com" }
```

---

### `DELETE /admin/admins/:id`
Удалить администратора с указанным ID.

**Ответ**
- `204 No Content` при успешном удалении
- `404` если администратор не найден

---

### `PATCH /admin/admins/:id/pass`
Сменить пароль администратора.

**Тело запроса**
```json
{ "password": "newPassword456" }
```

**Ответ**
- `204 No Content` при успешном обновлении
- `404` если администратор не найден