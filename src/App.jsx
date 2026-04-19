import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import AppRoutes from './routes/AppRoutes';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';

const Main = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f5f6;
  @media screen and (max-width: 495px) {
  background-color: white;
 }
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Main>
            <AppRoutes />
          </Main>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;