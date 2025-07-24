import React from 'react';
import styles from '../styles/CommentModal.module.css';

interface Comment {
  id: string | number;
  author_email?: string | null;
  body?: string;
  created_at?: string;
}

interface CommentModalProps {
  ideaTitle: string;
  comments: Comment[];
  loading: boolean;
  deletingCommentId: string | number | null;
  onClose: () => void;
  onDelete: (commentId: string | number) => void;
}

const formatDate = (dateString?: string) => {
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

const CommentModal: React.FC<CommentModalProps> = ({
  ideaTitle,
  comments,
  loading,
  deletingCommentId,
  onClose,
  onDelete
}) => {
  return (
<div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} title="Закрыть">×</button>
        <h2>Комментарии к идее: {ideaTitle}</h2>
        {loading ? (
          <div>Загрузка...</div>
        ) : comments.length === 0 ? (
          <div style={{margin: '1rem 0'}}>Нет комментариев</div>
        ) : (
          <ul className={styles.commentsList}>
          {comments.map(comment => (
              <li key={comment.id} className={styles.commentItem}>
                <div><b>{comment.author_email || 'Аноним'}</b> <span style={{color:'#888', fontSize:12}}>{formatDate(comment.created_at)}</span></div>
                <div>{comment.body}</div>
                <button
                  className={styles.deleteCommentBtn}
                  onClick={() => onDelete(comment.id)}
                  disabled={deletingCommentId === comment.id}
                  style={{marginTop:4, color:'#e53935'}}>
                  {deletingCommentId === comment.id ? 'Удаление...' : 'Удалить'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
