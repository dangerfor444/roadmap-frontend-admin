import React, { useState } from 'react';
import styles from '../styles/LoginPage.module.css';
import { useNavigate } from 'react-router-dom';


interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        onLogin();
        navigate('/');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Вход для администратора</h2>
        <div className={styles.inputGroup}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required className={styles.input} />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.loginButton}>Войти</button>
      </form>
    </div>
  );
};

export default LoginPage; 