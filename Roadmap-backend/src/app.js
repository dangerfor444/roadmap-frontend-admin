import cors from 'cors';
import express from 'express';
import db from './db.js';
import { apiKey } from './middleware/apiKey.js';
import { rateLimit } from './middleware/rateLimit.js';
import { createIdeaHandler, listIdeas } from './routes/ideas.js';
import {
    listRoadmaps,
    createRoadmap,
    updateRoadmap
  } from './routes/roadmaps.js';
import { createVote } from './routes/votes.js';
import { listComments, createComment } from './routes/comments.js';
import { getWidgetData } from './routes/widget.js';
import { listAllRoadmaps } from './routes/admin/roadmaps.js';
import { createAdminRoadmap } from './routes/admin/roadmaps.js';
import { updateAdminRoadmap } from './routes/admin/roadmaps.js';
import { deleteAdminRoadmap } from './routes/admin/roadmaps.js';
import { listAllIdeas } from './routes/admin/ideas.js';
import { updateIdeaState } from './routes/admin/ideas.js';
import { deleteIdea } from './routes/admin/ideas.js';
import { listVotesForIdea } from './routes/admin/votes.js';
import { listAdminComments, deleteComment } from './routes/admin/comments.js';
import { adminLogin } from './routes/admin/auth.js';
import { requireAdminAuth } from './middleware/requireAdminAuth.js';
import {
  listAdmins,
  createAdmin,
  deleteAdmin,
  updateAdminPassword,
  listServices,
} from './routes/admin/admins.js';
import { setupSwagger } from './swagger.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5174', 'http://localhost:5173'] }));

// Добавляем db в req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Применяем middleware ко всем маршрутам, кроме публичных:
app.use(async (req, res, next) => {
  const publicPaths = ['/widget', '/health', '/docs', '/swagger.json'];
  if (publicPaths.some(path => req.path.startsWith(path))) return next();
  await apiKey(req, res, next);
});

app.get('/ideas', listIdeas);
app.post('/ideas', rateLimit(5, 60_000), createIdeaHandler);

app.get('/roadmaps', listRoadmaps);
app.post('/roadmaps', createRoadmap);
app.patch('/roadmaps/:id', updateRoadmap);

app.post('/votes', rateLimit(10, 60_000), createVote);
app.get('/comments', listComments);
app.post('/comments', rateLimit(10, 60_000), createComment);
app.get('/widget/:slug', getWidgetData);

app.get('/admin/roadmaps', requireAdminAuth, listAllRoadmaps);
app.post('/admin/roadmaps', requireAdminAuth, createAdminRoadmap);
app.patch('/admin/roadmaps/:id', requireAdminAuth, updateAdminRoadmap);
app.delete('/admin/roadmaps/:id', requireAdminAuth, deleteAdminRoadmap);

app.get('/admin/ideas', requireAdminAuth, listAllIdeas);
app.patch('/admin/ideas/:id', requireAdminAuth, updateIdeaState);
app.delete('/admin/ideas/:id', requireAdminAuth, deleteIdea);
app.get('/admin/ideas/:id/votes', requireAdminAuth, listVotesForIdea);

app.get('/admin/comments', requireAdminAuth, listAdminComments);
app.delete('/admin/comments/:id', requireAdminAuth, deleteComment);


app.get('/admin/admins', requireAdminAuth, listAdmins);
app.post('/admin/admins', requireAdminAuth, createAdmin);
app.delete('/admin/admins/:id', requireAdminAuth, deleteAdmin);
app.patch('/admin/admins/:id/pass', requireAdminAuth, updateAdminPassword);

app.get('/admin/services', requireAdminAuth, listServices);

app.post('/admin/login', adminLogin);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

setupSwagger(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});