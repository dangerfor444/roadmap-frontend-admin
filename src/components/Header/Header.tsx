import React from 'react';
import styles from '../../styles/Header.module.css';

interface HeaderProps {
  services: string[];
  selectedService: string;
  onSelectService: (service: string) => void;
}

const Header: React.FC<HeaderProps> = ({ services, selectedService, onSelectService }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h1 className={styles.title}>Admin Panel</h1>
        </div>
        <nav className={styles.servicesNav}>
          {services.map(service => (
            <button
              key={service}
              className={service === selectedService ? styles.serviceActive : styles.serviceBtn}
              onClick={() => onSelectService(service)}
              type="button"
            >
              {service}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header; 