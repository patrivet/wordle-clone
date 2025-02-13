import styled from '@emotion/styled';
import Close from '../../assets/svgs/Close';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalOverlay = styled.dialog`
  --padding: 16px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100dvh;
  width: calc(100dvw - var(--padding) * 2);
  background-color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: var(--padding);
  border: none;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  & button {
    background: none;
    border: none;
    cursor: pointer;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin: 16px 0 32px;
`;

const Modal: React.FC<ModalProps> = ({ isOpen = true, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ButtonWrapper onClick={onClose}>
        <button>
          <Close />
        </button>
      </ButtonWrapper>
      <Title>Statistics</Title>
    </ModalOverlay>
  );
};

export default Modal;
