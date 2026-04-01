import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/vector.svg';

const HeaderWrapper = styled.header`
  background-color: #ffffff;
  width: 100%;
  `;

const HeaderContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 118px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoBlock = styled.div``;

const LogoImg = styled.img`
  
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
`;

const StyledNavLink = styled(NavLink)`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 170%;
  text-align: center;
  text-decoration: none;
  transition: color 0.2s;
  color: #999999;

  &.active {
    color: #7334ea;
  }

  &:hover {
    color: #7334ea;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 170%;
  text-align: center;
  color: #000000;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #7334ea;
  }
`;

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Скрываем навигацию и кнопку выхода на страницах входа и регистрации
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <HeaderWrapper>
      <HeaderContent>
        <LogoBlock>
          <LogoImg src={logo} alt="SkyproWallet" />
        </LogoBlock>
        {!isAuthPage && (
          <>
            <Nav>
              <StyledNavLink to="/" end>
                Мои расходы
              </StyledNavLink>
              <StyledNavLink to="/analysis">
                Анализ расходов
              </StyledNavLink>
            </Nav>
            <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
          </>
        )}
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;