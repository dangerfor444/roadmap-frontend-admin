import React, { useState } from 'react';
import styles from '../styles/EditIdeaModal.module.css';

interface EditIdeaModalProps {
  initialTitle: string;
  initialBody: string;
  onSave: (title: string, body: string) => void;
  onClose: () => void;
  loading: boolean;
}

const EditIdeaModal: React.FC<EditIdeaModalProps> = ({ initialTitle, initialBody, onSave, onClose, loading }) => {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.editModalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} title="Закрыть">×</button>
        <h2>Редактировать идею</h2>
        <div className={styles.fieldBlock}>
          <label className={styles.label}>Название</label>
          <input
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            disabled={loading}
          />
        </div>
        <div className={styles.fieldBlock}>
          <label className={styles.label}>Описание</label>
          <textarea
            className={styles.textarea}
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
            maxLength={1000}
            disabled={loading}
          />
        </div>
        <button
          className={styles.saveBtn}
          onClick={() => onSave(title, body)}
          disabled={loading || !title.trim() || !body.trim()}
        >
          {loading ? 'Сохраняю...' : 'Изменить'}
        </button>
      </div>
    </div>
  );
};

export default EditIdeaModal; 