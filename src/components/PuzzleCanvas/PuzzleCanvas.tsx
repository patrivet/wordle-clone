import { useEffect, useRef, useState } from 'react';
import Guess from '../Guess';
import GameHeader from '../GameHeader';
import Keyboard from '../Keyboard';
import Modal from '../Modal';
import SettingsModal from '../SettingsModal';
import useOverlay from '../../hooks/useOverlay';
import { useAppStoreActions, useAppStoreState } from '../../state/state';
import type { Guess as GuessType, LetterStatus } from '../../types';
import {
  analyseGuess,
  buildShareText,
  dictionarySearch,
  getHardModeViolation,
} from '../../utils';
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
  const settings = useAppStoreState(state => state.settings);
  const {
    commitGuess,
    deleteLetter,
    enterLetter,
    setAutoFillGreenLetters,
    setFrozenLettersPersist,
    setHardMode,
    toggleFrozenLetter,
  } = useAppStoreActions(actions => actions);
  const [overlayMessage, showOverlay] = useOverlay();
  const [invalidState, setInvalidState] = useState<InvalidState | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [revealState, setRevealState] = useState<RevealState | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [winningGuessIndex, setWinningGuessIndex] = useState<number | null>(null);
  const inputLocked = useRef(false);
  const physicalKeyDownHandler = useRef<(event: KeyboardEvent) => void>(() => {});
  const timeoutIds = useRef<number[]>([]);

  useEffect(
    () => () => timeoutIds.current.forEach(timeoutId => window.clearTimeout(timeoutId)),
    []
  );

  useEffect(() => {
    const handlePhysicalKeyDown = (event: KeyboardEvent) =>
      physicalKeyDownHandler.current(event);

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown);
  }, []);

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
      showOverlay('Splendid', 2000, () => setShowStatistics(true));
      const timeoutId = window.setTimeout(() => setWinningGuessIndex(null), 1000);
      timeoutIds.current.push(timeoutId);
      return;
    }

    if (guessIndex === 5) {
      showOverlay(puzzleDefinition.answer, 3000, () => setShowStatistics(true));
    }
  };

  const submitGuess = async () => {
    const currentGuess = puzzlePlay.guesses[currentGuessIndex];
    if (
      !currentGuess ||
      currentGuess.letters.some(member => !member.letter)
    ) {
      triggerInvalidGuess('Not enough letters');
      return;
    }

    if (settings.hardMode) {
      const violation = getHardModeViolation(
        currentGuess.word,
        puzzlePlay.guesses.slice(0, currentGuessIndex)
      );
      if (violation) {
        triggerInvalidGuess(violation);
        return;
      }
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

  physicalKeyDownHandler.current = event => {
    if (
      showSettings ||
      showStatistics ||
      keyboardDisabled ||
      inputLocked.current ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    const target = event.target;
    const isEditableTarget =
      target instanceof HTMLElement &&
      (target.matches('input, textarea, select') || target.isContentEditable);

    if (isEditableTarget) return;

    if (/^[a-z]$/i.test(event.key)) {
      event.preventDefault();
      handleKeyPress(event.key, true);
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      handleKeyPress('delete', false);
      return;
    }

    const activatesFocusedControl =
      target instanceof HTMLElement &&
      Boolean(target.closest('button, a[href], [role="button"]'));

    if (event.key === 'Enter' && !activatesFocusedControl) {
      event.preventDefault();
      handleKeyPress('enter', false);
    }
  };

  const shareResults = async (): Promise<'copied' | 'shared'> => {
    const text = buildShareText(
      puzzleDefinition,
      puzzlePlay,
      settings.hardMode
    );

    if (typeof navigator.share === 'function') {
      await navigator.share({ text });
      return 'shared';
    }

    if (!navigator.clipboard?.writeText) {
      throw new Error('Sharing is not supported in this browser');
    }

    await navigator.clipboard.writeText(text);
    return 'copied';
  };

  return (
    <>
      <GameHeader
        onOpenSettings={() => setShowSettings(true)}
        onOpenStatistics={() => setShowStatistics(true)}
        statisticsAvailable={puzzlePlay.gameStatus !== 'playing'}
      />
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
              freezeDisabled={keyboardDisabled}
              isInvalid={invalidState?.guessIndex === index}
              isRevealing={isRevealing}
              isWinning={winningGuessIndex === index}
              key={index}
              onToggleFreeze={toggleFrozenLetter}
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
      {showSettings && (
        <SettingsModal
          autoFillGreenLetters={settings.autoFillGreenLetters}
          frozenLettersPersist={settings.frozenLettersPersist}
          hardMode={settings.hardMode}
          hardModeLocked={currentGuessIndex > 0}
          onClose={() => setShowSettings(false)}
          onAutoFillGreenLettersChange={setAutoFillGreenLetters}
          onFrozenLettersPersistChange={setFrozenLettersPersist}
          onHardModeChange={setHardMode}
          puzzleNumber={puzzleDefinition.number}
        />
      )}
      {showStatistics && (
        <Modal
          isOpen
          onClose={() => setShowStatistics(false)}
          onShare={shareResults}
        />
      )}
    </>
  );
};

export default PuzzleCanvas;
