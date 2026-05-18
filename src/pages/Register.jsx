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

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [loginTouched, setLoginTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [nameError, setNameError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateName = (value) => {
    if (!value) return "Введите имя";
    return "";
  };
  const validateLogin = (value) => {
  if (!value) return "Введите email";
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (!emailRegex.test(value)) return "Введите корректный email";
  return "";
};
  const validatePassword = (value) => {
    if (!value) return "Введите пароль";
    if (value.length < 6) return "Пароль должен содержать не менее 6 символов";
    return "";
  };

  useEffect(() => {
    if (nameTouched || submitAttempted) setNameError(validateName(name));
  }, [name, nameTouched, submitAttempted]);
  useEffect(() => {
    if (loginTouched || submitAttempted) setLoginError(validateLogin(login));
  }, [login, loginTouched, submitAttempted]);
  useEffect(() => {
    if (passwordTouched || submitAttempted) setPasswordError(validatePassword(password));
  }, [password, passwordTouched, submitAttempted]);

  const isFormValid = () => {
    return !validateName(name) && !validateLogin(login) && !validatePassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameTouched(true);
    setLoginTouched(true);
    setPasswordTouched(true);
    setSubmitAttempted(true);

    const nameErr = validateName(name);
    const loginErr = validateLogin(login);
    const passwordErr = validatePassword(password);

    if (nameErr || loginErr || passwordErr) {
      setNameError(nameErr);
      setLoginError(loginErr);
      setPasswordError(passwordErr);
      setGeneralError(
        "Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку."
      );
      return;
    }

    const result = await register(login, password, name);
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
  }, [name, login, password, submitAttempted, isFormValid]);

  const isButtonDisabled = submitAttempted && !isFormValid();

  return (
    <Container>
      <Title>Регистрация</Title>
      <Form onSubmit={handleSubmit}>
        <FieldWrapper $hasError={nameError}>
          <Input
            type="text"
            name="name"
            placeholder="Имя"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameTouched(true);
            }}
            $hasError={nameError}
            $isValid={nameTouched && !nameError && name}
          />
        </FieldWrapper>
        <FieldWrapper $hasError={loginError}>
          <Input
            type="text"
            name="login"
            placeholder="Логин"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
              setLoginTouched(true);
            }}
            $hasError={loginError}
            $isValid={loginTouched && !loginError && login}
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
          Зарегистрироваться
        </SubmitButton>
      </Form>
      <LinkText>
        Уже есть аккаунт? <Link to="/login">Войдите здесь</Link>
      </LinkText>
    </Container>
  );
};

export default Register;