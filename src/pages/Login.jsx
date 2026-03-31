import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  width: 379px;
  background: white;
  border-radius: 30px;
  box-shadow: 0px 20px 67px -12px rgba(0, 0, 0, 0.21);
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  text-align: center;
  color: #333;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  width: 313px;
  height: 39px;
  padding: 12px;
  border: 0.5px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  color: #000;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #7334ea;
  }
`;

const Button = styled.button`
  width: 313px;
  height: 39px;
  background-color: #7334ea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 12px;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5b2ab5;
  }
`;

const LinkText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #999999;
  text-align: center;
  display: flex;
  flex-direction: column;

  a {
    color: #999999;
    text-decoration: underline;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  return (
    <Container>
      <Title>Вход</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Эл. почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Войти</Button>
      </Form>
      <LinkText>
        Нужно зарегистрироваться? <Link to="/register">Регистрируйтесь здесь</Link>
      </LinkText>
    </Container>
  );
};

export default Login;