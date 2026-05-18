import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { Input, SubmitButton, ErrorMessage } from "../styles/FormStyles";

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
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  text-align: center;
  color: #333;
  margin: 0;
`;

const LinkText = styled.p`
  font-family: "Montserrat", sans-serif;
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

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [loginTouched, setLoginTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateLogin = (value) => {
    if (!value) return "Поле обязательно для заполнения";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Поле обязательно для заполнения";
    return "";
  };

  useEffect(() => {
    if (loginTouched || submitAttempted) {
      setLoginError(validateLogin(loginValue));
    }
  }, [loginValue, loginTouched, submitAttempted]);

  useEffect(() => {
    if (passwordTouched || submitAttempted) {
      setPasswordError(validatePassword(password));
    }
  }, [password, passwordTouched, submitAttempted]);

  const isFormValid = () => {
    return !validateLogin(loginValue) && !validatePassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginTouched(true);
    setPasswordTouched(true);
    setSubmitAttempted(true);

    const loginErr = validateLogin(loginValue);
    const passwordErr = validatePassword(password);

    if (loginErr || passwordErr) {
      setLoginError(loginErr);
      setPasswordError(passwordErr);
      setGeneralError(
        "Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку."
      );
      return;
    }

    const result = await login(loginValue, password);
    if (!result.success) {
      setGeneralError(result.error);
      setSubmitAttempted(false);
      return;
    }

    setGeneralError("");
    setSubmitAttempted(false);
    navigate("/");
  };

  useEffect(() => {
    if (submitAttempted && isFormValid()) {
      setGeneralError("");
    }
  }, [loginValue, password, submitAttempted, isFormValid]);

  const isButtonDisabled = submitAttempted && !isFormValid();

  return (
    <Container>
      <Title>Вход</Title>
      <Form onSubmit={handleSubmit}>
        <FieldWrapper $hasError={loginError}>
          <Input
            type="text"
            name="login"
            placeholder="Логин"
            value={loginValue}
            onChange={(e) => {
              setLoginValue(e.target.value);
              setLoginTouched(true);
            }}
            $hasError={loginError}
            $isValid={loginTouched && !loginError && loginValue}
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
        Нужно зарегистрироваться?{" "}
        <Link to="/register">Регистрируйтесь здесь</Link>
      </LinkText>
    </Container>
  );
};

export default Login;