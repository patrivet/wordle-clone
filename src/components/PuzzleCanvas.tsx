import { useState } from 'react';
import Keyboard from './Keyboard';
import Guess from './Guess';
import styled from '@emotion/styled';

const GuessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`;

const PuzzleCanvas = ({ puzzlePlay }) => { // using puzzlePlay as prop - but could read from state instead?
  const handleKeyPress = (keyPressed: string, isLetter: boolean = false) => {
    const guessUpdated = guessesLocal[activeRow];
    guessUpdated.letters[guessUpdated.nextLetterIndex].letter = keyPressed;
    guessUpdated.nextLetterIndex += 1;
    // update guessesLocal with the updated guess
    setLocalGuesses(currState => {
      return currState.map((guess, index) => {
        return index === activeRow ? guessUpdated : guess;
      });
    });
  };

  const [guessesLocal, setLocalGuesses] = useState(puzzlePlay?.guesses);
  let activeRow = 0; // TODO: make dynamic/update on Guess submission in state?

  return (
    <div>
      <div>PuzzleCanvas</div>
      <GuessWrapper>
        {guessesLocal.map((guess, index) => {
          return <Guess guess={guess} index={index} />;
        })}
      </GuessWrapper>
      <Keyboard onKeyClick={handleKeyPress} />
    </div>
  );
};

export default PuzzleCanvas;
