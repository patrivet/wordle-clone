import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import type { Guess as GuessType, LetterStatus } from '../types';

type GuessProps = {
  guess: GuessType;
  index: number;
  isCurrent: boolean;
  isInvalid: boolean;
  invalidAnimationKey: number;
  isRevealing: boolean;
  isWinning: boolean;
};

const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  40% { transform: scale(1.1); opacity: 1; }
`;

const reveal = keyframes`
  0% {
    background-color: transparent;
    border-color: #878a8c;
    color: #000;
    transform: rotateX(0deg);
  }
  49.9% {
    background-color: transparent;
    border-color: #878a8c;
    color: #000;
    transform: rotateX(-90deg);
  }
  50% {
    background-color: var(--reveal-color);
    border-color: var(--reveal-color);
    color: white;
    transform: rotateX(-90deg);
  }
  100% {
    background-color: var(--reveal-color);
    border-color: var(--reveal-color);
    color: white;
    transform: rotateX(0deg);
  }
`;

const shake = keyframes`
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
`;

const bounce = keyframes`
  0%, 20% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  50% { transform: translateY(5px); }
  60% { transform: translateY(-15px); }
  80% { transform: translateY(2px); }
  100% { transform: translateY(0); }
`;

const statusColour = (status?: LetterStatus): string => {
  switch (status) {
    case 'grey':
      return 'var(--grey)';
    case 'yellow':
      return 'var(--yellow)';
    case 'green':
      return 'var(--green)';
    default:
      return 'transparent';
  }
};

const GuessLetter = styled.span<{
  $animateEntry: boolean;
  $position: number;
  $status?: LetterStatus;
  $isRevealing: boolean;
}>`
  align-items: center;
  background-color: ${props => statusColour(props.$status)};
  border: 2px solid
    ${props =>
      props.$status ? statusColour(props.$status) : props.children ? '#878a8c' : '#d3d6da'};
  box-sizing: border-box;
  color: ${props => (props.$status ? 'white' : '#000')};
  display: flex;
  font-size: 32px;
  height: 52px;
  justify-content: center;
  width: 52px;

  ${props =>
    props.$animateEntry &&
    css`
      animation: ${popIn} 100ms;
    `}

  ${props =>
    props.$isRevealing &&
    css`
      --reveal-color: ${statusColour(props.$status)};
      animation: ${reveal} 500ms ease-in ${props.$position * 300}ms both;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation-delay: 0ms;
    animation-duration: 1ms;
  }
`;

const GuessRow = styled.div<{ $isInvalid: boolean; $isWinning: boolean }>`
  display: flex;
  gap: 5px;
  justify-content: center;
  width: 100%;

  ${props =>
    props.$isInvalid &&
    css`
      animation: ${shake} 600ms;
    `}

  ${props =>
    props.$isWinning &&
    css`
      animation: ${bounce} 1000ms;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1ms;
  }
`;

const ordinal = (position: number): string => {
  const ordinals = ['1st', '2nd', '3rd', '4th', '5th'];
  return ordinals[position] ?? `${position + 1}th`;
};

const tileLabel = (
  position: number,
  letter: string,
  status?: LetterStatus
): string => {
  if (!letter) return `${ordinal(position)} letter, empty`;
  if (status === 'green') return `${ordinal(position)} letter, ${letter}, correct`;
  if (status === 'yellow') {
    return `${ordinal(position)} letter, ${letter}, present in another position`;
  }
  if (status === 'grey') return `${ordinal(position)} letter, ${letter}, absent`;
  return `${ordinal(position)} letter, ${letter}`;
};

const Guess = ({
  guess,
  index,
  isCurrent,
  isInvalid,
  invalidAnimationKey,
  isRevealing,
  isWinning,
}: GuessProps) => (
  <GuessRow
    key={`${index}-${invalidAnimationKey}`}
    className="guess"
    $isInvalid={isInvalid}
    $isWinning={isWinning}
  >
    {guess.letters.map((member, letterIndex) => (
      <GuessLetter
        aria-label={tileLabel(letterIndex, member.letter, member.status)}
        aria-roledescription="tile"
        data-animation={
          isRevealing ? 'flip' : isCurrent && member.letter ? 'pop' : 'idle'
        }
        data-state={member.status ?? (member.letter ? 'tbd' : 'empty')}
        key={letterIndex}
        role="img"
        $animateEntry={isCurrent && Boolean(member.letter) && !isRevealing}
        $isRevealing={isRevealing}
        $position={letterIndex}
        $status={member.status}
      >
        {member.letter}
      </GuessLetter>
    ))}
  </GuessRow>
);

export default Guess;
