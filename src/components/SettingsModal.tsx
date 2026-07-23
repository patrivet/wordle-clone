import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import Close from '../assets/svgs/Close';

const Backdrop = styled.div`
  align-items: center;
  background: rgb(0 0 0 / 50%);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 16px;
  position: fixed;
  z-index: 1000;
`;

const Panel = styled.section`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgb(0 0 0 / 20%);
  box-sizing: border-box;
  max-width: 500px;
  padding: 24px 32px;
  position: relative;
  width: 100%;

  @media (max-width: 520px) {
    align-self: flex-end;
    border-radius: 8px 8px 0 0;
    margin: -16px;
    padding: 24px;
    width: calc(100% + 32px);
  }
`;

const Title = styled.h2`
  font-size: 20px;
  letter-spacing: 0.04em;
  margin: 0 0 28px;
  text-align: center;
`;

const CloseButton = styled.button`
  align-items: center;
  background: none;
  border: 0;
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: 16px;
  top: 14px;
  width: 40px;
`;

const SettingRow = styled.div`
  align-items: center;
  border-bottom: 1px solid #d3d6da;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  min-height: 74px;
  padding: 8px 0 18px;
`;

const SettingCopy = styled.div`
  h3 {
    font-family: Arial, sans-serif;
    font-size: 18px;
    font-weight: normal;
    margin: 0 0 3px;
  }

  p {
    color: #565758;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.25;
    margin: 0;
  }
`;

const Switch = styled.button`
  background: #878a8c;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  flex: 0 0 42px;
  height: 24px;
  padding: 2px;
  transition: background-color 150ms;

  &::after {
    background: #fff;
    border-radius: 50%;
    content: '';
    display: block;
    height: 20px;
    transform: translateX(0);
    transition: transform 150ms;
    width: 20px;
  }

  &[aria-checked='true'] {
    background: var(--green);
  }

  &[aria-checked='true']::after {
    transform: translateX(18px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::after {
      transition: none;
    }
  }
`;

const Footer = styled.footer`
  color: #565758;
  display: flex;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: normal;
  justify-content: space-between;
  padding-top: 20px;
`;

type SettingsModalProps = {
  hardMode: boolean;
  hardModeLocked: boolean;
  onClose: () => void;
  onHardModeChange: (enabled: boolean) => void;
  puzzleNumber: number;
};

const SettingsModal = ({
  hardMode,
  hardModeLocked,
  onClose,
  onHardModeChange,
  puzzleNumber,
}: SettingsModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <Backdrop>
      <Panel aria-labelledby="settings-title" aria-modal="true" role="dialog">
        <CloseButton
          aria-label="Close settings"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <Close />
        </CloseButton>
        <Title id="settings-title">SETTINGS</Title>
        <SettingRow>
          <SettingCopy>
            <h3>Hard Mode</h3>
            <p>Any revealed hints must be used in subsequent guesses</p>
          </SettingCopy>
          <Switch
            aria-checked={hardMode}
            aria-label="Hard Mode"
            disabled={hardModeLocked}
            onClick={() => onHardModeChange(!hardMode)}
            role="switch"
            type="button"
          />
        </SettingRow>
        <Footer>
          <span>Wordle Clone</span>
          <span>#{puzzleNumber}</span>
        </Footer>
      </Panel>
    </Backdrop>
  );
};

export default SettingsModal;
