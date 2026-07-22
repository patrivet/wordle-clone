import styled from '@emotion/styled';
import type { LetterStatus } from '../types';

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 8px;
`;

const Row = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const Key = styled.button<{ $isEnter: boolean }>`
  align-items: center;
  background-color: #d3d6da;
  border: none;
  border-radius: 4px;
  color: black;
  cursor: pointer;
  display: flex;
  flex: 1;
  font-size: ${props => (props.$isEnter ? '12px' : '20px')};
  font-weight: bold;
  height: 58px;
  justify-content: center;
  min-width: 0;
  padding: 0;
  transition:
    background-color 100ms,
    transform 100ms,
    filter 100ms;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);

  &:active:not(:disabled) {
    filter: brightness(0.9);
    transform: scale(0.95);
  }

  &:disabled {
    cursor: default;
  }

  &[data-status] {
    color: white;
  }

  &[data-status='grey'] {
    background-color: var(--grey);
  }

  &[data-status='yellow'] {
    background-color: var(--yellow);
  }

  &[data-status='green'] {
    background-color: var(--green);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

type KeyMember =
  | string
  | {
      key: 'enter' | 'delete';
      value: React.ReactNode;
      label: string;
    };

type KeyboardProps = {
  disabled: boolean;
  letterStatuses: Record<string, LetterStatus>;
  onKeyClick: (key: string, isLetter: boolean) => void;
};

const Keyboard = ({
  disabled,
  letterStatuses,
  onKeyClick,
}: KeyboardProps) => {
  const deleteKey = (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <path
        fill="currentColor"
        d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
      />
    </svg>
  );
  const topRow: KeyMember[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const middleRow: KeyMember[] = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const bottomRow: KeyMember[] = [
    { key: 'enter', value: 'ENTER', label: 'enter' },
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    { key: 'delete', value: deleteKey, label: 'backspace' },
  ];

  const renderKey = (keyMember: KeyMember) => {
    const key = typeof keyMember === 'string' ? keyMember : keyMember.key;
    const value = typeof keyMember === 'string' ? keyMember : keyMember.value;
    const label =
      typeof keyMember === 'string' ? `add ${key.toLowerCase()}` : keyMember.label;
    const isLetter = typeof keyMember === 'string';

    return (
      <Key
        aria-label={label}
        data-key={key}
        data-status={isLetter ? letterStatuses[key] : undefined}
        disabled={disabled}
        key={key}
        onClick={() => onKeyClick(key, isLetter)}
        type="button"
        $isEnter={key === 'enter'}
      >
        {value}
      </Key>
    );
  };

  return (
    <KeyboardContainer aria-label="On-screen keyboard">
      <Row>{topRow.map(renderKey)}</Row>
      <Row>{middleRow.map(renderKey)}</Row>
      <Row>{bottomRow.map(renderKey)}</Row>
    </KeyboardContainer>
  );
};

export default Keyboard;
