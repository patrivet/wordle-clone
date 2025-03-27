import styled from '@emotion/styled';
import Close from '../../assets/svgs/Close';
import Share from '../../assets/svgs/Share';

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
  align-items: center;
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
  align-self: flex-end;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin: 16px 0 32px;
`;

const ShareButton = styled.button`
  background-color: #58a351;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  border-radius: 104px;
  width: 250px;
  height: 44px;
  width: 198px;
  cursor: pointer;
  padding: 0 16px;
  > span {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: white;
    font-style: normal;
    letter-spacing 0.64px;
  }
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
      <ShareButton>
        <span>Share</span>
        <Share />
      </ShareButton>
    </ModalOverlay>
  );
};

export default Modal;
