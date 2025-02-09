import { useState } from 'react';
import Keyboard from '../Keyboard';
import Guess from '../Guess';
import { Guess as GuessType } from '../../types'
import { useStoreState, useStoreActions } from 'easy-peasy';
import { analyseGuess, dictionarySearch } from '../../utils';
import useOverlay from '../../hooks/useOverlay';
import {
  GuessWrapper,
  OverlayMessage,
  OverlayWrapper,
} from './PuzzleCanvas.style';

const PuzzleCanvas = ({ puzzlePlay }) => {
  // using puzzlePlay as prop - but could read from state instead like puzzleDefintiion?
  const puzzleDefinition = useStoreState(state => state.puzzleDefinition);
  const updatePuzzlePlay = useStoreActions(actions => actions.updatePuzzlePlay);
  const [overlayMessage, showOverlay] = useOverlay() as [
    string | null,
    (message: string, duration?: number) => void
  ];

  const activeGuess = puzzlePlay.activeGuess;
  const [guessesLocal, setLocalGuesses] = useState(
    puzzlePlay?.guesses.map(guess => {
      return {
        ...guess,
        letters: guess.letters.map(letter => ({ ...letter })),
      };
    })
  );

  const handleKeyPress = async (
    keyPressed: string | any,
    isLetter: boolean = false
  ) => {
    const guessUpdated = guessesLocal[activeGuess];
    const letterBeingSet = guessUpdated.nextLetterIndex;

    if (!isLetter) {
      // Handle delete and submit
      if (keyPressed === 'delete') {
        guessUpdated.letters[letterBeingSet - 1] = {}; // reset the GuessLetter object entirely - not just the letter
        guessUpdated.nextLetterIndex -= 1;
      }
      if (keyPressed === 'enter') {
        console.log(`>> SUBMIT GUESS`);

        // if not enough letters - show a dialog & rtn
        if (letterBeingSet !== 5) {
          showOverlay('Not enough letters', 3000);
          return;
        }
        // Check if guess is not a found work
        const res = await dictionarySearch(guessUpdated.word);
        if (!res) {
          showOverlay('Not in word list', 3000);
          return;
        }

        // Now we 5 letters and a dictionary word- analyse each letter:
        const analysedGuess = analyseGuess(
          guessesLocal[activeGuess],
          puzzleDefinition
        );
        updateGuesses(analysedGuess);
      }
    } else {
      // letter handling
      if (letterBeingSet === 5) return; // guess length reached- nothing to do.
      guessUpdated.letters[letterBeingSet].letter = keyPressed;
      guessUpdated.nextLetterIndex += 1;
      guessUpdated.word = guessUpdated.letters.reduce((acc, nextMem) => {
        return (acc += nextMem.letter);
      }, '');
    }

    // update guessesLocal with the updated guess
    setLocalGuesses(currState => {
      return currState.map((guess, index) => {
        return index === activeGuess ? guessUpdated : guess;
      });
    });
  };

  const updateGuesses = (guessToUpdate: GuessType) => {
    const updatedPuzzlePlay = {
      ...puzzlePlay,
      guesses: puzzlePlay.guesses.map((guess, index) =>
        index === activeGuess ? guessToUpdate : guess
      ),
      activeGuess: activeGuess + 1, // Increment active guess
      letterStatuses: guessToUpdate.letters.reduce((acc, guessLetter) => {
        if (guessLetter.status) {
          if (acc[guessLetter.letter] !== 'green') acc[guessLetter.letter] = guessLetter.status;
        }
        return acc;
      }, {...puzzlePlay.letterStatuses})
    };
    updatePuzzlePlay(updatedPuzzlePlay);
  };

  return (
    <>
      {overlayMessage && (
        <OverlayWrapper messageLen={overlayMessage.length}>
          <OverlayMessage messageLen={overlayMessage.length}>{overlayMessage}</OverlayMessage>
        </OverlayWrapper>
      )}
      <GuessWrapper>
        {guessesLocal.map((guess, index) => {
          return <Guess guess={guess} index={index} />;
        })}
      </GuessWrapper>
      <Keyboard onKeyClick={handleKeyPress} />
    </>
  );
};

export default PuzzleCanvas;
