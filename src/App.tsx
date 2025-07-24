import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import { useNavigate } from 'react-router-dom';


function App() {
  const [isAdmin, setIsAdmin] = useState(() => Boolean(localStorage.getItem('token')));
  const [ideas, setIdeas] = useState<any[]>([]);
  const [services, setServices] = useState<{ id: number; name: string; slug: string; api_key: string }[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/services`, {
          headers: {
            'x-api-key': API_KEY,
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        if (!response.ok) throw new Error('Ошибка загрузки сервисов');
        const data = await response.json();
        setServices(data);
        if (data.length > 0) setSelectedService(data[0].name);
      } catch (e) {
        // Можно добавить обработку ошибки
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!selectedService) return;
      const service = services.find(s => s.name === selectedService);
      if (!service) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/ideas`, {
          headers: {
            'x-api-key': service.api_key,
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        if (!response.ok) throw new Error('Ошибка загрузки идей');
        const data = await response.json();
        setIdeas(data.ideas);
      } catch (e) {
        // Можно добавить обработку ошибки
      }
    };
    fetchIdeas();
  }, [selectedService, services]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    navigate('/login');
  };

  const filteredIdeas = ideas;

  if (!isAdmin) {
    return <LoginPage onLogin={() => setIsAdmin(true)} />;
  }

  return (
    <>
      <Header
        services={services.map(s => s.name)}
        selectedService={selectedService}
        onSelectService={setSelectedService}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 1400, margin: '0 auto', padding: '1rem' }}>
        <button onClick={handleLogout} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer' }}>Выйти</button>
      </div>
      <MainPage ideas={filteredIdeas} setIdeas={setIdeas} selectedService={selectedService} selectedServiceApiKey={services.find(s => s.name === selectedService)?.api_key || ''} />
    </>
  );
}

export default App;
