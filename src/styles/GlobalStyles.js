import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    background-color: #F4F5F6;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :root {
    --bg-primary: #F4F5F6;
    --header-bg: #ffffff;
    --text-primary: #000000;
    --text-secondary: #333333;
    --accent: #7334EA;
    --accent-hover: #5b2ab5;
    --error-bg: #FFEBEB;
    --error-border: #F25050;
    --error-text: #F84D4D;
    --valid-bg: #F1EBFD;
    --valid-border: #7334EA;
    --gray-light: #F4F5F6;
    --gray-border: #EEEEEE;
    --gray-text: #999999;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  input, button, textarea, select {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Стили для скроллбаров (опционально) */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #F0F0F0;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #CCC;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;