import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import Close from '../assets/svgs/Close';
import type { AutoFillGreenLettersMode } from '../types';

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
  max-height: calc(100vh - 32px);
  max-width: 500px;
  overflow-y: auto;
  padding: 24px 32px;
  position: relative;
  width: 100%;

  @media (max-width: 520px) {
    align-self: flex-end;
    border-radius: 8px 8px 0 0;
    margin: -16px;
    max-height: calc(100vh - 16px);
    padding: 24px;
    width: calc(100% + 32px);
  }
`;

const ChoiceGroup = styled.fieldset`
  border: 0;
  border-bottom: 1px solid #d3d6da;
  margin: 0;
  padding: 18px 0;
`;

const ChoiceLegend = styled.legend`
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-weight: normal;
  padding: 0;
`;

const ChoiceDescription = styled.p`
  color: #565758;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.25;
  margin: 3px 0 12px;
`;

const ChoiceList = styled.div`
  display: grid;
  gap: 4px;
`;

const Choice = styled.label`
  align-items: flex-start;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 7px 8px;

  &:hover {
    background: #f6f7f8;
  }

  &:focus-within {
    outline: 2px solid #005fcc;
    outline-offset: 1px;
  }
`;

const ChoiceRadio = styled.input`
  accent-color: var(--green);
  flex: 0 0 auto;
  height: 18px;
  margin: 1px 0 0;
  width: 18px;

  &:focus-visible {
    outline: none;
  }
`;

const ChoiceCopy = styled.span`
  display: grid;
  font-family: Arial, sans-serif;
  font-size: 15px;
  font-weight: normal;
  gap: 2px;
  line-height: 1.2;

  small {
    color: #565758;
    font-family: Arial, sans-serif;
    font-size: 13px;
    font-weight: normal;
  }
`;

const Recommended = styled.span`
  background: #e5f2e3;
  border-radius: 999px;
  color: #3f6f3c;
  font-family: Arial, sans-serif;
  font-size: 11px;
  font-weight: bold;
  margin-left: 6px;
  padding: 2px 6px;
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
  autoFillGreenLetters: AutoFillGreenLettersMode;
  frozenLettersPersist: boolean;
  hardMode: boolean;
  hardModeLocked: boolean;
  onClose: () => void;
  onAutoFillGreenLettersChange: (mode: AutoFillGreenLettersMode) => void;
  onFrozenLettersPersistChange: (enabled: boolean) => void;
  onHardModeChange: (enabled: boolean) => void;
  puzzleNumber: number;
};

const SettingsModal = ({
  autoFillGreenLetters,
  frozenLettersPersist,
  hardMode,
  hardModeLocked,
  onClose,
  onAutoFillGreenLettersChange,
  onFrozenLettersPersistChange,
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
        <ChoiceGroup>
          <ChoiceLegend>Auto-fill green letters</ChoiceLegend>
          <ChoiceDescription>
            Place confirmed green letters in the same positions in your next
            guess
          </ChoiceDescription>
          <ChoiceList>
            <Choice>
              <ChoiceRadio
                checked={autoFillGreenLetters === 'off'}
                name="auto-fill-green-letters"
                onChange={() => onAutoFillGreenLettersChange('off')}
                type="radio"
                value="off"
              />
              <ChoiceCopy>
                <span>Off</span>
                <small>Don&apos;t carry green letters forward</small>
              </ChoiceCopy>
            </Choice>
            <Choice>
              <ChoiceRadio
                checked={autoFillGreenLetters === 'editable'}
                name="auto-fill-green-letters"
                onChange={() => onAutoFillGreenLettersChange('editable')}
                type="radio"
                value="editable"
              />
              <ChoiceCopy>
                <span>Editable</span>
                <small>Add as normal letters that can be deleted</small>
              </ChoiceCopy>
            </Choice>
            <Choice>
              <ChoiceRadio
                checked={autoFillGreenLetters === 'frozen'}
                name="auto-fill-green-letters"
                onChange={() => onAutoFillGreenLettersChange('frozen')}
                type="radio"
                value="frozen"
              />
              <ChoiceCopy>
                <span>
                  Frozen
                  <Recommended aria-hidden="true">Recommended</Recommended>
                </span>
                <small>Add frozen; hold to unfreeze before deleting</small>
              </ChoiceCopy>
            </Choice>
            <Choice>
              <ChoiceRadio
                checked={autoFillGreenLetters === 'locked'}
                name="auto-fill-green-letters"
                onChange={() => onAutoFillGreenLettersChange('locked')}
                type="radio"
                value="locked"
              />
              <ChoiceCopy>
                <span>Locked</span>
                <small>Add permanently; they cannot be changed</small>
              </ChoiceCopy>
            </Choice>
          </ChoiceList>
        </ChoiceGroup>
        <SettingRow>
          <SettingCopy>
            <h3>Frozen letters persist</h3>
            <p>Carry frozen letters into the next guess</p>
          </SettingCopy>
          <Switch
            aria-checked={frozenLettersPersist}
            aria-label="Frozen letters persist"
            onClick={() =>
              onFrozenLettersPersistChange(!frozenLettersPersist)
            }
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
