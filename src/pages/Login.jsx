import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Input, SubmitButton, ErrorMessage } from '../styles/FormStyles';

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

const FieldWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;

  ${({ $hasError }) =>
    $hasError &&
    `
      &::after {
        content: '*';
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #f25050;
        font-size: 16px;
        font-weight: bold;
        pointer-events: none;
      }
    `}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateEmail = (value) => {
    if (!value) return 'Поле обязательно для заполнения';
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Введите корректный email';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Поле обязательно для заполнения';
    return '';
  };

  // Обновляем ошибку email при изменении, если поле было тронуто или была попытка отправки
  useEffect(() => {
    if (emailTouched || submitAttempted) {
      setEmailError(validateEmail(email));
    }
  }, [email, emailTouched, submitAttempted]);

  // Обновляем ошибку пароля при изменении, если поле было тронуто или была попытка отправки
  useEffect(() => {
    if (passwordTouched || submitAttempted) {
      setPasswordError(validatePassword(password));
    }
  }, [password, passwordTouched, submitAttempted]);

  const isFormValid = () => {
    return !validateEmail(email) && !validatePassword(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);
    setSubmitAttempted(true);

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setGeneralError('Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.');
      return;
    }

    // Успех — сбрасываем ошибки и выполняем вход
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    setSubmitAttempted(false);
    login(email, password);
    navigate('/');
  };

  // Если после неудачной отправки форма стала валидной, снимаем общее сообщение и флаг
  useEffect(() => {
    if (submitAttempted && isFormValid()) {
      setGeneralError('');
      setSubmitAttempted(false);
    }
  }, [email, password, submitAttempted, isFormValid]);

  const isButtonDisabled = submitAttempted && !isFormValid();

  return (
    <Container>
      <Title>Вход</Title>
      <Form onSubmit={handleSubmit}>
        <FieldWrapper $hasError={emailError}>
          <Input
            type="email"
            name="email"
            placeholder="Эл. почта"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailTouched(true);
            }}
            $hasError={emailError}
            $isValid={emailTouched && !emailError && email}
          />
        </FieldWrapper>
        <FieldWrapper $hasError={passwordError}>
          <Input
            type="password"
            name="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordTouched(true);
            }}
            $hasError={passwordError}
            $isValid={passwordTouched && !passwordError && password}
          />
        </FieldWrapper>
        {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
        <SubmitButton type="submit" $disabled={isButtonDisabled}>
          Войти
        </SubmitButton>
      </Form>
      <LinkText>
        Нужно зарегистрироваться? <Link to="/register">Регистрируйтесь здесь</Link>
      </LinkText>
    </Container>
  );
};

export default Login;