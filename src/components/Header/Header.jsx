import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/vector.svg';
import treangle from '../../assets/pictureTreangle.png'
import { useState } from "react";
import { usePageName } from '/src/context/MenuNavMobileContext';

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
  
  @media screen and (max-width: 495px) {
  max-width: 495pxpx;
  padding: 0 16px;
  margin: 0 auto;
  background-color: #F4F5F6;
}
`;

const LogoBlock = styled.div``;

const LogoImg = styled.img`
  @media screen and (max-width: 495px) {
  width:109px;
  height:14px;
}
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
  @media screen and (max-width: 495px) {
  display: none;
}
`;
const NavMobile = styled.nav`
  display: none;
  @media screen and (max-width: 495px) {
    display: block;
    z-index: 10;
    gap:10px;
}
`
const NavMenu = styled.nav`
  position:absolute;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  width:140px;
  height:110px;
  background-color: #ffffff;
  border-radius: 6px;
  border: 0.5px solid #999999;
  padding: 10px;
`
const ItemNav = styled(NavLink)`
  height: 26px;
  background-color: #F4F5F6;
  font-weight: 400;
  font-size: 10px;
  padding: 7px 14px;
  border-radius: 24px;
  &:hover {
    background-color: #F1EBFD;
    color:  #7334ea
  }
`
const StyledNavLink = styled(NavLink)`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 170%;
  text-align: center;
  text-decoration: none;
  transition: color 0.2s;
  color: #999999;
  @media screen and (max-width: 495px) {
   padding-right: 7px;
  }
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
  @media screen and (max-width: 495px) {
  font-size: 12px;
 }
`;
const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const { pageNameInNav, setPageNameInNav } = usePageName("Мои расходы");

  const handleNamePage = (title) => {
    setPageNameInNav(title);
    setIsVisible(false); // закрываем меню после выбора
  };

  const openNav = () => {
    setIsVisible(!isVisible);
  };

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
            <NavMobile>
              <StyledNavLink onClick={openNav}>
                {pageNameInNav}
              </StyledNavLink>
              <img src={treangle} alt="SkyproWallet" />
              {isVisible && (
                <NavMenu>
                  <ItemNav
                    onClick={() => handleNamePage('Мои расходы')}
                    to="/myExpenses"
                  >
                    Мои расходы
                  </ItemNav>
                  <ItemNav
                    onClick={() => handleNamePage('Новый расход')}
                    to="/newExpenses"
                  >
                    Новый расход
                  </ItemNav>
                  <ItemNav
                    onClick={() => handleNamePage('Анализ расходов')}
                    to="/analysis"
                  >
                    Анализ расходов
                  </ItemNav>
                </NavMenu>
              )}
            </NavMobile>
            <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
          </>
        )}
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;