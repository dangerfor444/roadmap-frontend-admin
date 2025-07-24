import React, { useState } from 'react';
import styles from '../styles/MainPage.module.css';
import CommentModal from '../components/CommentModal';
import IdeaModal from '../components/IdeaModal';
import EditIdeaModal from '../components/EditIdeaModal';

interface Comment {
  id: string | number;
  author?: string | null;
  text?: string;
  date?: string;
}

interface MainPageProps {
  ideas: any[];
  setIdeas: React.Dispatch<React.SetStateAction<any[]>>;
  selectedService: string;
  selectedServiceApiKey: string;
}

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};
const get14DaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  return d.toISOString().slice(0, 10);
};

const MainPage: React.FC<MainPageProps> = ({ ideas, setIdeas, selectedService, selectedServiceApiKey }) => {
  const [dateFrom, setDateFrom] = React.useState(get14DaysAgo());
  const [dateTo, setDateTo] = React.useState(getToday());
  const [commentsModal, setCommentsModal] = useState<{open: boolean, idea: any | null}>({open: false, idea: null});
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | number | null>(null);
  const [statusEdits, setStatusEdits] = useState<{[id: number]: string}>({});
  const [ideaModal, setIdeaModal] = useState<{open: boolean, idea: any | null}>({open: false, idea: null});
  const [ideaVotes, setIdeaVotes] = useState<{[id: number]: any[]}>({});
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [editModal, setEditModal] = useState<{open: boolean, idea: any | null}>({open: false, idea: null});
  const [editLoading, setEditLoading] = useState(false);

  const handleResetDates = () => {
    setDateFrom(get14DaysAgo());
    setDateTo(getToday());
  };

  const shiftDates = (direction: 'back' | 'forward') => {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const delta = 14 * 24 * 60 * 60 * 1000;
    if (direction === 'back') {
      from.setTime(from.getTime() - delta);
      to.setTime(to.getTime() - delta);
    } else {
      from.setTime(from.getTime() + delta);
      to.setTime(to.getTime() + delta);
    }
    setDateFrom(from.toISOString().slice(0, 10));
    setDateTo(to.toISOString().slice(0, 10));
  };

  const handleSpam = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/ideas/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': selectedServiceApiKey,
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) throw new Error('Ошибка удаления идеи');
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    } catch (e) {
      alert('Ошибка при удалении идеи!');
    }
  };

  const handleOpenComments = async (idea: any) => {
    setCommentsModal({open: true, idea});
    setLoadingComments(true);
    try {
      const token = localStorage.getItem('token');
      const apiKey = selectedServiceApiKey;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/comments?idea=${idea.id}`, {
        headers: {
          'x-api-key': apiKey,
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) throw new Error('Ошибка загрузки комментариев');
      const data = await response.json();
      setComments(Array.isArray(data.comments) ? data.comments : data);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCloseComments = () => {
    setCommentsModal({open: false, idea: null});
    setComments([]);
  };

  const handleDeleteComment = async (commentId: string | number) => {
    setDeletingCommentId(commentId);
    try {
      const token = localStorage.getItem('token');
      const apiKey = selectedServiceApiKey;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': apiKey,
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok && response.status !== 204) throw new Error('Ошибка удаления комментария');
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (e) {
      alert('Ошибка при удалении комментария!');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleStatusChange = async (idea: any, newStatus: string) => {
    const token = localStorage.getItem('token');
    const apiKey = selectedServiceApiKey;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/ideas/${idea.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Ошибка обновления статуса');
      setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, status: newStatus } : i));
    } catch (e) {
      alert('Ошибка при обновлении статуса!');
    }
  };

  const handleStatusSelect = (ideaId: number, value: string) => {
    setStatusEdits(prev => ({ ...prev, [ideaId]: value }));
  };

  const handleStatusUpdate = async (idea: any) => {
    const newStatus = statusEdits[idea.id] ?? idea.status;
    const token = localStorage.getItem('token');
    const apiKey = selectedServiceApiKey;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/ideas/${idea.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Ошибка обновления статуса');
      setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, status: newStatus } : i));
      setStatusEdits(prev => { const copy = { ...prev }; delete copy[idea.id]; return copy; });
    } catch (e) {
      alert('Ошибка при обновлении статуса!');
    }
  };

  const handleOpenIdea = async (idea: any) => {
    setIdeaModal({open: true, idea});
    if (!ideaVotes[idea.id]) {
      setLoadingVotes(true);
      try {
        const token = localStorage.getItem('token');
        const apiKey = selectedServiceApiKey;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/ideas/${idea.id}/votes`, {
          headers: {
            'x-api-key': apiKey,
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIdeaVotes(prev => ({ ...prev, [idea.id]: Array.isArray(data.votes) ? data.votes : data }));
        }
      } finally {
        setLoadingVotes(false);
      }
    }
  };
  const handleCloseIdea = () => {
    setIdeaModal({open: false, idea: null});
  };

  const handleOpenEdit = (idea: any) => {
    setEditModal({open: true, idea});
  };
  const handleCloseEdit = () => {
    setEditModal({open: false, idea: null});
  };
  const handleSaveEdit = async (title: string, body: string) => {
    if (!editModal.idea) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiKey = selectedServiceApiKey;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/ideas/${editModal.idea.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ title, body }),
      });
      if (!response.ok) throw new Error('Ошибка при изменении идеи');
      setIdeas(prev => prev.map(i => i.id === editModal.idea.id ? { ...i, title, body } : i));
      handleCloseEdit();
    } catch (e) {
      alert('Ошибка при изменении идеи!');
    } finally {
      setEditLoading(false);
    }
  };

  // Фильтрация по дате
  const filterByDate = (idea: any) => {
    let ideaDate = idea.date || idea.created_at || '';
    // Приводим к формату YYYY-MM-DD
    if (ideaDate.includes('T')) {
      ideaDate = ideaDate.split('T')[0];
    }
    if (ideaDate.includes('.')) {
      ideaDate = ideaDate.split('.').reverse().join('-');
    }
    return (!dateFrom || ideaDate >= dateFrom) && (!dateTo || ideaDate <= dateTo);
  };

  const filteredIdeas = ideas.filter(filterByDate);

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <main className={styles.adminContainer}>
      <h2 className={styles.serviceTitle}>Идеи для сервиса: {selectedService}</h2>
      <div className={styles.filtersRow}>
        <button
          type="button"
          className={styles.shiftBtn}
          onClick={() => shiftDates('back')}
          title="Назад на 2 недели"
        >
          &#8592;
        </button>
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className={styles.dateInput}
          placeholder="От"
        />
        <span className={styles.dash}>—</span>
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className={styles.dateInput}
          placeholder="До"
        />
        <button
          type="button"
          className={styles.shiftBtn}
          onClick={() => shiftDates('forward')}
          title="Вперёд на 2 недели"
        >
          &#8594;
        </button>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={handleResetDates}
        >
          Сбросить
        </button>
      </div>
      <div className={styles.cardsGrid}>
        {filteredIdeas.length === 0 ? (
          <div style={{textAlign: 'center', color: '#888', width: '100%'}}>Нет идей для этого сервиса</div>
        ) : (
          filteredIdeas.map(idea => (
            <div key={idea.id} className={styles.ideaCard} onClick={() => handleOpenIdea(idea)}>
              <div className={styles.ideaCardTitle}>{idea.title}</div>
              <div className={styles.ideaCardBody}>{
                typeof idea.body === 'string' && idea.body.length > 30
                  ? idea.body.slice(0, 15) + '...'
                  : idea.body
              }</div>
              <div className={styles.ideaCardDate}>{formatDate(idea.date || idea.created_at || '')}</div>
              <div className={styles.ideaCardStatus + ' ' + styles['status_' + (idea.status || 'new')]}>Статус: {statusLabel(idea.status)}</div>
            </div>
          ))
        )}
      </div>
      {/* Модальное окно идеи */}
      {ideaModal.open && ideaModal.idea && (
        <IdeaModal
          idea={ideaModal.idea}
          statusValue={statusEdits[ideaModal.idea.id] ?? ideaModal.idea.status ?? 'new'}
          onStatusSelect={value => handleStatusSelect(ideaModal.idea.id, value)}
          onStatusUpdate={() => handleStatusUpdate(ideaModal.idea)}
          statusUpdateDisabled={statusEdits[ideaModal.idea.id] === undefined || statusEdits[ideaModal.idea.id] === ideaModal.idea.status}
          onSpam={() => { handleSpam(ideaModal.idea.id); handleCloseIdea(); }}
          onComments={() => { handleOpenComments(ideaModal.idea); }}
          onClose={handleCloseIdea}
          votes={ideaVotes[ideaModal.idea.id]}
          onEdit={() => handleOpenEdit(ideaModal.idea)}
        />
      )}
      {editModal.open && editModal.idea && (
        <EditIdeaModal
          initialTitle={editModal.idea.title}
          initialBody={editModal.idea.body}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
          loading={editLoading}
        />
      )}
      {/* Модальное окно комментариев */}
      {commentsModal.open && (
        <CommentModal
          ideaTitle={commentsModal.idea?.title || ''}
          comments={comments}
          loading={loadingComments}
          deletingCommentId={deletingCommentId}
          onClose={handleCloseComments}
          onDelete={handleDeleteComment}
        />
      )}
    </main>
  );
};

export default MainPage;

function statusLabel(status: string) {
  if (status === 'done') return 'Готово';
  if (status === 'at_work') return 'В работе';
  return 'Новая';
}
