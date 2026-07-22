import { useEffect, useRef, useState } from 'react';
import Guess from '../Guess';
import Keyboard from '../Keyboard';
import Modal from '../Modal';
import useOverlay from '../../hooks/useOverlay';
import { useAppStoreActions, useAppStoreState } from '../../state/state';
import type { Guess as GuessType, LetterStatus } from '../../types';
import { analyseGuess, dictionarySearch } from '../../utils';
import {
  DebugAnswer,
  GuessWrapper,
  OverlayMessage,
  OverlayWrapper,
} from './PuzzleCanvas.style';

const REVEAL_DURATION_MS = 500;
const REVEAL_STAGGER_MS = 300;
const REVEAL_TOTAL_MS = REVEAL_DURATION_MS + REVEAL_STAGGER_MS * 4;

type RevealState = {
  guess: GuessType;
  guessIndex: number;
  previousLetterStatuses: Record<string, LetterStatus>;
};

type InvalidState = {
  attempt: number;
  guessIndex: number;
};

const PuzzleCanvas = () => {
  const puzzleDefinition = useAppStoreState(state => state.puzzleDefinition);
  const puzzlePlay = useAppStoreState(state => state.puzzlePlay);
  const { commitGuess, deleteLetter, enterLetter } = useAppStoreActions(
    actions => actions
  );
  const [overlayMessage, showOverlay] = useOverlay();
  const [invalidState, setInvalidState] = useState<InvalidState | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [revealState, setRevealState] = useState<RevealState | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [winningGuessIndex, setWinningGuessIndex] = useState<number | null>(null);
  const inputLocked = useRef(false);
  const timeoutIds = useRef<number[]>([]);

  useEffect(
    () => () => timeoutIds.current.forEach(timeoutId => window.clearTimeout(timeoutId)),
    []
  );

  if (!puzzleDefinition) return null;

  const currentGuessIndex = puzzlePlay.currentGuessIndex;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const keyboardDisabled =
    isValidating || Boolean(revealState) || puzzlePlay.gameStatus !== 'playing';
  const showDebugAnswer =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('showAnswer') === '1';

  const triggerInvalidGuess = (message: string) => {
    setInvalidState(current => ({
      attempt: (current?.attempt ?? 0) + 1,
      guessIndex: currentGuessIndex,
    }));
    showOverlay(message, 2000);

    const timeoutId = window.setTimeout(() => setInvalidState(null), 600);
    timeoutIds.current.push(timeoutId);
  };

  const finishReveal = (analysedGuess: GuessType, guessIndex: number) => {
    inputLocked.current = false;
    setRevealState(null);

    if (analysedGuess.isAnswer) {
      setWinningGuessIndex(guessIndex);
      showOverlay('Splendid', 2000, () => setShowModal(true));
      const timeoutId = window.setTimeout(() => setWinningGuessIndex(null), 1000);
      timeoutIds.current.push(timeoutId);
      return;
    }

    if (guessIndex === 5) {
      showOverlay(puzzleDefinition.answer, 3000);
    }
  };

  const submitGuess = async () => {
    const currentGuess = puzzlePlay.guesses[currentGuessIndex];
    if (!currentGuess || currentGuess.word.length !== 5) {
      triggerInvalidGuess('Not enough letters');
      return;
    }

    inputLocked.current = true;
    setIsValidating(true);
    const isDictionaryWord = await dictionarySearch(currentGuess.word);
    setIsValidating(false);

    if (!isDictionaryWord) {
      inputLocked.current = false;
      triggerInvalidGuess('Not in word list');
      return;
    }

    const analysedGuess = analyseGuess(currentGuess, puzzleDefinition);
    const nextRevealState: RevealState = {
      guess: analysedGuess,
      guessIndex: currentGuessIndex,
      previousLetterStatuses: puzzlePlay.letterStatuses,
    };

    setRevealState(nextRevealState);
    commitGuess(analysedGuess);

    const timeoutId = window.setTimeout(
      () => finishReveal(analysedGuess, currentGuessIndex),
      prefersReducedMotion ? 0 : REVEAL_TOTAL_MS
    );
    timeoutIds.current.push(timeoutId);
  };

  const handleKeyPress = (keyPressed: string, isLetter: boolean) => {
    if (keyboardDisabled || inputLocked.current) return;

    if (isLetter) {
      enterLetter(keyPressed);
    } else if (keyPressed === 'delete') {
      deleteLetter();
    } else if (keyPressed === 'enter') {
      void submitGuess();
    }
  };

  return (
    <>
      {showDebugAnswer && (
        <DebugAnswer data-testid="debug-answer">
          Answer: {puzzleDefinition.answer}
        </DebugAnswer>
      )}
      {overlayMessage && (
        <OverlayWrapper>
          <OverlayMessage>{overlayMessage}</OverlayMessage>
        </OverlayWrapper>
      )}
      <GuessWrapper aria-label="Wordle board">
        {puzzlePlay.guesses.map((storedGuess, index) => {
          const isRevealing = revealState?.guessIndex === index;
          const displayedGuess = isRevealing ? revealState.guess : storedGuess;
          return (
            <Guess
              guess={displayedGuess}
              index={index}
              invalidAnimationKey={invalidState?.attempt ?? 0}
              isCurrent={index === currentGuessIndex && !revealState}
              isInvalid={invalidState?.guessIndex === index}
              isRevealing={isRevealing}
              isWinning={winningGuessIndex === index}
              key={index}
            />
          );
        })}
      </GuessWrapper>
      <Keyboard
        disabled={keyboardDisabled}
        letterStatuses={
          revealState?.previousLetterStatuses ?? puzzlePlay.letterStatuses
        }
        onKeyClick={handleKeyPress}
      />
      {showModal && <Modal isOpen onClose={() => setShowModal(false)} />}
    </>
  );
};

export default PuzzleCanvas;
