import { useState } from 'react';
import Keyboard from '../Keyboard';
import Guess from '../Guess';
import Modal from '../Modal';
import { Guess as GuessType } from '../../types';
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

  const activeRow = puzzlePlay.activeRow;
  const [guessesLocal, setLocalGuesses] = useState<GuessType[]>(
    puzzlePlay?.guesses.map(guess => {
      return {
        ...guess,
        letters: guess.letters.map(letter => ({ ...letter })),
      };
    })
  );
  const [showModal, setShowModal] = useState(false);

  const handleKeyPress = async (
    keyPressed: string | any,
    isLetter: boolean = false
  ) => {
    // if the game has already ended - do nothing.
    // if a guess exists where isAnswer === true
    //
    // if (puzzlePlay.activeRow > 5) {
    //   console.log(
    //     `>> temp log:: handleKeyPress(); activeRow > 5 -  Game is complete - returning`
    //   );
    //   return;
    // }
    // if (puzzlePlay.guesses[activeRow - 1].isAnswer) {
    //   console.log(
    //     `>> temp log:: handleKeyPress(); last guess was answer -  Game is complete - returning`
    //   );
    //   return;
    // }

    const guessUpdated = guessesLocal[activeRow];
    const letterBeingSet = guessUpdated.nextLetterIndex;

    if (!isLetter) {
      // Handle delete and submit
      if (keyPressed === 'delete') {
        guessUpdated.letters[letterBeingSet - 1] = {}; // reset the GuessLetter object entirely - not just the letter
        guessUpdated.nextLetterIndex -= 1;
      }
      if (keyPressed === 'enter') {
        console.log(`>> SUBMIT GUESS`);

        // Check for 5 letters
        if (letterBeingSet !== 5) {
          showOverlay('Not enough letters', 3000);
          return;
        }
        // Check is a word
        const res = await dictionarySearch(guessUpdated.word);
        if (!res) {
          showOverlay('Not in word list', 3000);
          return;
        }

        // Analyse the word
        const analysedGuess = analyseGuess(
          guessesLocal[activeRow],
          puzzleDefinition
        );
        // Guess is the answer
        if (analysedGuess.isAnswer) {
          showOverlay('Splendid', 3000, () => setShowModal(true));
          return;
        }

        // Guess is NOt answer and is last guess
        // tbc
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
        return index === activeRow ? guessUpdated : guess;
      });
    });
  };

  const updateGuesses = (guessToUpdate: GuessType) => {
    const updatedPuzzlePlay = {
      ...puzzlePlay,
      guesses: puzzlePlay.guesses.map((guess, index) =>
        index === activeRow ? guessToUpdate : guess
      ),
      activeRow: activeRow + 1, // Increment active guess
      letterStatuses: guessToUpdate.letters.reduce(
        (acc, guessLetter) => {
          if (guessLetter.status) {
            if (acc[guessLetter.letter] !== 'green')
              acc[guessLetter.letter] = guessLetter.status;
          }
          return acc;
        },
        { ...puzzlePlay.letterStatuses }
      ),
    };
    updatePuzzlePlay(updatedPuzzlePlay);
  };

  return (
    <>
      {overlayMessage && (
        <OverlayWrapper messageLen={overlayMessage.length}>
          <OverlayMessage messageLen={overlayMessage.length}>
            {overlayMessage}
          </OverlayMessage>
        </OverlayWrapper>
      )}
      <GuessWrapper>
        {guessesLocal.map((guess, index) => {
          return <Guess guess={guess} index={index} />;
        })}
      </GuessWrapper>
      <Keyboard onKeyClick={handleKeyPress} />
      {showModal === true && (
        <Modal isOpen onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default PuzzleCanvas;
