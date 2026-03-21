import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет вызов API
    console.log('Login with', email, password);
    // После успешного входа переходим на главную
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2>Вход</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <input
            type="email"
            placeholder="Эл. почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
      </form>
    
        <button type="submit" className={styles.btn}>Войти</button>
        <div>
          <p className={styles.link}>
          Нужно зарегистрироваться? 
          <Link to="/register">Регистрируйтесь здесь</Link>
        </p>
      
        
      </div>
    </div>
  );
};

export default Login;