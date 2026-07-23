import { useState } from 'react';
import styled from '@emotion/styled';
import Close from '../../assets/svgs/Close';
import Share from '../../assets/svgs/Share';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => Promise<'copied' | 'shared'>;
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
    letter-spacing: 0.64px;
  }
`;

const ShareFeedback = styled.p`
  color: #565758;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  min-height: 18px;
`;

const Modal: React.FC<ModalProps> = ({ isOpen = true, onClose, onShare }) => {
  const [shareFeedback, setShareFeedback] = useState('');

  if (!isOpen) return null;

  const handleShare = async () => {
    try {
      const result = await onShare();
      setShareFeedback(
        result === 'copied' ? 'Results copied to clipboard' : 'Results shared'
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareFeedback('Unable to share results');
    }
  };

  return (
    <ModalOverlay aria-labelledby="statistics-title" aria-modal="true" open>
      <ButtonWrapper>
        <button aria-label="Close statistics" onClick={onClose} type="button">
          <Close />
        </button>
      </ButtonWrapper>
      <Title id="statistics-title">Statistics</Title>
      <ShareButton aria-label="Share results" onClick={() => void handleShare()}>
        <span>{shareFeedback ? 'Share again' : 'Share'}</span>
        <Share />
      </ShareButton>
      <ShareFeedback aria-live="polite">{shareFeedback}</ShareFeedback>
    </ModalOverlay>
  );
};

export default Modal;
