


# 📘 Public API Endpoints

All requests (except `/widget/:slug` and `/health`) must include a valid `x-api-key` header.

---

### 💡 POST `/ideas`
Create a new idea. The idea is hidden by default until approved.

Body:
```json
{
  "title": "My idea",
  "body": "A detailed suggestion...",
  "author_email": "user@example.com" // optional
}
```

Returns:
```json
{
  "idea": {
    "id": 1,
    "title": "My idea",
    "body": "A detailed suggestion...",
    "state": "hidden"
  }
}
```

---

### 🧭 GET `/roadmaps`
List all roadmaps for the current service.

Returns:
```json
{
  "roadmaps": [ ... ]
}
```

---

### 🧭 POST `/roadmaps`
Create a new roadmap.

Body:
```json
{
  "title": "Roadmap Q4",
  "description": "Our plans for Q4"
}
```

---

### 🧭 PATCH `/roadmaps/:id`
Update roadmap (title, description, is_published).

Body:
```json
{
  "title": "New Title",
  "is_published": true
}
```

---

### ✅ GET `/tasks`
List all tasks for current service.

Returns:
```json
{
  "tasks": [ ... ]
}
```

---

### ✅ POST `/tasks`
Create a new task under a roadmap.

Body:
```json
{
  "roadmap_id": 1,
  "title": "Add billing system",
  "body": "Description"
}
```

---

### ✅ PATCH `/tasks/:id`
Update a task.

Body:
```json
{
  "title": "New title",
  "status": "in_progress"
}
```

---

### 🔼 POST `/votes`
Vote or update a reaction for an idea.

Body:
```json
{
  "idea_id": 123,
  "reaction": "👍"
}
```

---

### 💬 GET `/comments?idea=123`
List comments for an idea.

---

### 💬 POST `/comments`
Add comment to an idea.

Body:
```json
{
  "idea_id": 123,
  "body": "This is a comment",
  "author_email": "user@example.com"
}
```

---

### 📦 GET `/widget/:slug`
Public widget data (roadmaps, ideas, tasks). No API key required.

Returns:
```json
{
  "roadmaps": [...],
  "ideas": [...],
  "tasks": [...]
}
```