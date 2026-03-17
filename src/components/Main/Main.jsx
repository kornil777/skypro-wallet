import { useNavigate } from 'react-router-dom';
import styles from './Main.module.css';

const Main = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Очистка токена и перенаправление на вход
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1>Добро пожаловать в SkyproWallet</h1>
      <div className={styles.buttons}>
        <button onClick={() => navigate('/expenses')} className={styles.btn}>
          Мои расходы
        </button>
        <button onClick={() => navigate('/analysis')} className={styles.btn}>
          Анализ расходов
        </button>
        <button onClick={handleLogout} className={`${styles.btn} ${styles.logout}`}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Main;