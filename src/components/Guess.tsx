import { Guess as GuessType } from '../types';
import styled from '@emotion/styled';

type GuessPropsType = {
  guess: GuessType;
  index: number;
};

const GuessLetter = styled.span<{ status?: string }>`
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => (props.status ? '52px' : '48px')};
  height: ${props => (props.status ? '52px' : '48px')};

  &:empty {
    border: 2px solid #d3d6da;
  }
  &:not(:empty) {
    border: ${props => (props.status ? 'none' : '2px solid #878a8c')};
  }

  color: ${props => (props.status ? 'white' : '#000')};
  background-color: ${props => {
    switch (props.status) {
      case 'grey':
        return `var(--grey)`;
      case 'yellow':
        return `var(--yellow)`;
      case 'green':
        return `var(--green)`;
    }
  }};
`;
const GuessRow = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
  justify-content: center;
`;

const Guess = ({ guess, index }: GuessPropsType): any => {
  const makeGuessRow = guess => {
    if (!guess) {
      return <GuessLetter />;
    }
    return guess.letters.map((mem, index) => (
      <GuessLetter key={index} status={mem.status}>
        {mem.letter}
      </GuessLetter>
    ));
  };

  return (
    <GuessRow className="guess" key={index}>
      {makeGuessRow(guess)}
    </GuessRow>
  );
};

export default Guess;
