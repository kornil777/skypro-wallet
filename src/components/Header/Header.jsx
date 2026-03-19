import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/vector.svg';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Левый блок: логотип */}
        <div className={styles.logoBlock}>
          <img src={logo} alt="SkyproWallet" className={styles.logoImg} />
        </div>

        {/* Центральный блок: навигация */}
        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            Мои расходы
          </NavLink>
          <NavLink
            to="/analysis"
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            Анализ расходов
          </NavLink>
        </nav>

        {/* Правый блок: кнопка выхода */}
        <div className={styles.logoutBlock}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;