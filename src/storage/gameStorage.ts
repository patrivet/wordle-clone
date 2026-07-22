import { createInitialPuzzlePlay } from '../state/state';
import {
  GuessStatus,
  type PuzzleDefinition,
  type PuzzlePlay,
} from '../types';
import { analyseGuess, mergeLetterStatuses } from '../utils';

const STORAGE_KEY = 'wordle-clone:game';
const STORAGE_VERSION = 1;

type StoredGame = {
  version: number;
  puzzleDate: string;
  puzzleNumber: number;
  submittedWords: string[];
};

const isStoredGame = (value: unknown): value is StoredGame => {
  if (!value || typeof value !== 'object') return false;

  const game = value as Partial<StoredGame>;
  return (
    game.version === STORAGE_VERSION &&
    typeof game.puzzleDate === 'string' &&
    typeof game.puzzleNumber === 'number' &&
    Array.isArray(game.submittedWords) &&
    game.submittedWords.length <= 6 &&
    game.submittedWords.every(word =>
      typeof word === 'string' ? /^[A-Z]{5}$/.test(word) : false
    )
  );
};

export const loadPuzzlePlay = (
  puzzleDefinition: PuzzleDefinition,
  storage: Storage = window.localStorage
): PuzzlePlay | null => {
  const storedValue = storage.getItem(STORAGE_KEY);
  if (!storedValue) return null;

  try {
    const storedGame: unknown = JSON.parse(storedValue);
    if (
      !isStoredGame(storedGame) ||
      storedGame.puzzleDate !== puzzleDefinition.date ||
      storedGame.puzzleNumber !== puzzleDefinition.number
    ) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }

    const puzzlePlay = createInitialPuzzlePlay();

    for (const [index, word] of storedGame.submittedWords.entries()) {
      const guess = analyseGuess(
        {
          letters: [...word].map(letter => ({ letter })),
          status: GuessStatus.InProgress,
          word,
          isAnswer: false,
        },
        puzzleDefinition
      );

      puzzlePlay.guesses[index] = guess;
      puzzlePlay.currentGuessIndex = index + 1;
      puzzlePlay.letterStatuses = mergeLetterStatuses(
        puzzlePlay.letterStatuses,
        guess
      );

      if (guess.isAnswer) {
        puzzlePlay.gameStatus = 'won';
        break;
      }
    }

    if (
      puzzlePlay.gameStatus === 'playing' &&
      puzzlePlay.currentGuessIndex === puzzlePlay.guesses.length
    ) {
      puzzlePlay.gameStatus = 'lost';
    }

    return puzzlePlay;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const savePuzzlePlay = (
  puzzleDefinition: PuzzleDefinition,
  puzzlePlay: PuzzlePlay,
  storage: Storage = window.localStorage
): void => {
  const submittedWords = puzzlePlay.guesses
    .slice(0, puzzlePlay.currentGuessIndex)
    .map(guess => guess.word);

  const storedGame: StoredGame = {
    version: STORAGE_VERSION,
    puzzleDate: puzzleDefinition.date,
    puzzleNumber: puzzleDefinition.number,
    submittedWords,
  };

  storage.setItem(STORAGE_KEY, JSON.stringify(storedGame));
};

export const clearSavedPuzzle = (
  storage: Storage = window.localStorage
): void => {
  storage.removeItem(STORAGE_KEY);
};
