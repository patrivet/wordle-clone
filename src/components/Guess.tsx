import { Guess as Bar } from '../state/reducer';
import styled from '@emotion/styled';

type GuessPropsType = {
  guess: Bar;
  index: number;
};

const GuessLetter = styled.span`
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => (props.status ? '56px' : '52px')};
  height: ${props => (props.status ? '56px' : '52px')};
  border: ${props => (props.status ? 'none' : '2px solid #d3d6da')};
  color: ${props => (props.status === 'complete' ? 'white' : '#000')};
  background-color: ${props => {
    switch (props.status) {
      case 'grey':
        return '#3a3a3c';
      case 'yellow':
        return '#b59f3b';
      case 'green':
        return '#538d4e';
    }
  }};
`;
const GuessRow = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
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
