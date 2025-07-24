import React from 'react';
import styles from '../styles/IdeaModal.module.css';

interface Vote {
  id: number;
  type: 'like' | 'dislike';
  // другие поля, если есть
}

interface IdeaModalProps {
  idea: any;
  statusValue: string;
  onStatusSelect: (value: string) => void;
  onStatusUpdate: () => void;
  statusUpdateDisabled: boolean;
  onSpam: () => void;
  onComments: () => void;
  onClose: () => void;
  votes?: Vote[];
  onEdit: () => void;
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function statusLabel(status: string) {
  if (status === 'done') return 'Готово';
  if (status === 'at_work') return 'В работе';
  return 'Новая';
}

const IdeaModal: React.FC<IdeaModalProps> = ({
  idea,
  statusValue,
  onStatusSelect,
  onStatusUpdate,
  statusUpdateDisabled,
  onSpam,
  onComments,
  onClose,
  votes,
  onEdit
}) => {
  const likes = votes?.filter(v => v.type === 'like').length || 0;
  const dislikes = votes?.filter(v => v.type === 'dislike').length || 0;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.ideaModalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} title="Закрыть">×</button>
        <button className={styles.editBtn} onClick={onEdit} title="Редактировать идею">✏️</button>
        <h2>{idea.title}</h2>
        <div className={styles.ideaModalBody}>{idea.body}</div>
        <div className={styles.ideaModalDate}>Дата: {formatDate(idea.date || idea.created_at || '')}</div>
        <div className={styles.ideaModalStatus + ' ' + styles['status_' + (idea.status || 'new')]}>Статус: {statusLabel(idea.status)}</div>
        <div className={styles.votesRow}>
          <span className={styles.likeIcon} title="Лайки">👍 {likes}</span>
          <span className={styles.dislikeIcon} title="Дизлайки">👎 {dislikes}</span>
        </div>
        <div className={styles.actionsRow}>
          <div className={styles.statusBlock}>
            <select
              value={statusValue}
              onChange={e => onStatusSelect(e.target.value)}
              className={styles.statusSelect}
            >
              <option value="new">Новая</option>
              <option value="at_work">В работе</option>
              <option value="done">Готово</option>
            </select>
            <button
              className={styles.statusUpdateBtn}
              disabled={statusUpdateDisabled}
              onClick={onStatusUpdate}
            >
              Обновить статус
            </button>
          </div>
          <div className={styles.buttonsBlock}>
            <button className={styles.spamBtn} onClick={onSpam}>Спам</button>
            <button className={styles.commentBtn} onClick={onComments}>Комментарии</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaModal; 