import styled, { css } from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// Общий стиль для полей ввода с поддержкой состояний
export const Input = styled.input`
  width: 313px;
  height: 39px;
  padding: 12px;
  border: 0.5px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  color: #000;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.2s;
  background-color: ${({ $hasError }) => ($hasError ? '#FFEBEB' : 'white')};
  border-color: ${({ $hasError }) => ($hasError ? '#F25050' : '#ccc')};
  

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #7334ea;
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      background-color: #ffebeb;
      border-color: #f25050;
      color: #f25050;
    `}

  ${({ $isValid }) =>
    $isValid &&
    css`
      background-color: #f1ebfd;
      border-color: #7334ea;
    `}
`;

export const FieldWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;

  ${({ $hasError }) =>
    $hasError &&
    css`
      &::after {
        content: '*';
        color: #f25050;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        font-weight: bold;
      }
    `}
`;

export const ErrorMessage = styled.div`
  color: #f84d4d;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f84d4d;
  text-align: center;
`;

export const SubmitButton = styled.button`
  width: 313px;
  height: 39px;
  background-color: ${({ $disabled }) => ($disabled ? '#999999' : '#7334ea')};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 12px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $disabled }) => ($disabled ? '#999999' : '#5b2ab5')};
  }
`;