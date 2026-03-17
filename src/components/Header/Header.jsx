import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '..//../assets/vector.svg';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="SkyproWallet" className={styles.logoImg} />
      </div>
    </header>
  );
};

export default Header;