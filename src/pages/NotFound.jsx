import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 72px;
  color: #7334ea;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
`;

const StyledLink = styled(Link)`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #7334ea;
  text-decoration: none;
  border: 1px solid #7334ea;
  padding: 12px 24px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: #7334ea;
    color: white;
  }
`;

const NotFound = () => {
  return (
    <Container>
      <Title>404</Title>
      <Message>Страница не найдена</Message>
      <StyledLink to="/">Вернуться на главную</StyledLink>
    </Container>
  );
};

export default NotFound;