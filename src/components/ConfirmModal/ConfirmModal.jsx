import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 400px;
  background: white;
  border-radius: 30px;
  padding: 24px;
  box-shadow: 0px 20px 67px -12px rgba(0, 0, 0, 0.21);
  box-sizing: border-box;
  text-align: center;
`;

const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  margin-bottom: 16px;
  color: #333;
`;

const Message = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 24px;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
`;

const ConfirmButton = styled(Button)`
  background-color: #f25050;
  color: white;

  &:hover {
    background-color: #d43c3c;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f4f5f6;
  color: #666;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ConfirmModal = ({ isOpen, onConfirm, onCancel, title = 'Подтверждение', message = 'Вы уверены, что хотите удалить этот расход?' }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>Отмена</CancelButton>
          <ConfirmButton onClick={onConfirm}>Удалить</ConfirmButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmModal;