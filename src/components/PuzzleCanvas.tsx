import { useState } from 'react';
import Keyboard from './Keyboard';
import Guess from './Guess';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { analyseGuess } from '../utils'
const GuessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;`;

const PuzzleCanvas = ({ puzzlePlay }) => { // using puzzlePlay as prop - but could read from state instead?
  const puzzleDefinition = useStoreState(state => state.puzzleDefinition);
  const updatePuzzlePlay = useStoreActions((actions) => actions.updatePuzzlePlay);

  // ! FIXME using props for puzzlePlay and useContext for puzzleDefintiion --- shouldn't this be uniform - i.e. use both from props or both from useContext.
  const activeGuess = puzzlePlay.activeGuess;
  const [guessesLocal, setLocalGuesses] = useState(
    puzzlePlay?.guesses.map(guess => {
      return { ...guess, letters: guess.letters.map(letter => ({ ...letter })) };
    })
  );

  const handleKeyPress = (keyPressed: string, isLetter: boolean = false) => {
    const guessUpdated = guessesLocal[activeGuess];
    const letterBeingSet = guessUpdated.nextLetterIndex;

    if (!isLetter) {
      // Handle delete and submit
      if (guessUpdated.nextLetterIndex === 0) return; // nothing to submit or delete when next index = 0
      if (keyPressed === '<') {
        guessUpdated.letters[letterBeingSet - 1] = {}; // reset the GuessLetter object entirely - not just the letter
        guessUpdated.nextLetterIndex -= 1;
      }
      if (keyPressed === 'ENTER') {
        console.log(`>> SUBMIT GUESS`);

        // if not enough letters - show a dialog & rtn
        if (letterBeingSet !== 5) {
          console.log(`>> SUBMIT GUESS - not enough letters =${guessUpdated.nextLetterIndex}`);
          // TODO: dialog handling here
          return;
        }
        // TODO : handling for submit
        const analysedGuess = analyseGuess(guessesLocal[activeGuess], puzzleDefinition);
        updateGuessesInContext(analysedGuess)
      }
    } else {
      // letter handling
      if (letterBeingSet === 5) return; // guess length reached- nothing to do.
      guessUpdated.letters[letterBeingSet].letter = keyPressed;
      guessUpdated.nextLetterIndex += 1;
      guessUpdated.word = guessUpdated.letters.reduce((acc, nextMem) => {
        return (acc += nextMem);
      }, '');
    }

    // update guessesLocal with the updated guess
    setLocalGuesses(currState => {
      return currState.map((guess, index) => {
        return index === activeGuess ? guessUpdated : guess;
      });
    });
  };

  const updateGuessesInContext = guessToUpdate => {
    // update guesses in global state - with the submitted guess
    // Create updated puzzlePlay object with new guesses array
    const updatedPuzzlePlay = {
      ...puzzlePlay,
      guesses: puzzlePlay.guesses.map((guess, index) =>
        index === activeGuess ? guessToUpdate : guess
      ),
      activeGuess: activeGuess + 1, // Increment active guess
    };
    // Update global state
    updatePuzzlePlay(updatedPuzzlePlay);
  };

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
