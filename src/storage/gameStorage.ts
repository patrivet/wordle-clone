import { createInitialPuzzlePlay } from '../state/state';
import {
  GuessStatus,
  type PuzzleDefinition,
  type PuzzlePlay,
} from '../types';
import { analyseGuess, mergeLetterStatuses } from '../utils';

const STORAGE_KEY = 'wordle-clone:game';
const STORAGE_VERSION = 2;

type StoredGameBase = {
  puzzleDate: string;
  puzzleNumber: number;
  submittedWords: string[];
};

type StoredCarriedLetter = {
  letter: string;
  position: number;
  state: 'editable' | 'frozen' | 'locked';
};

type StoredGame = StoredGameBase & {
  carriedLetters: StoredCarriedLetter[];
  version: typeof STORAGE_VERSION;
};

type LegacyStoredGame = StoredGameBase & {
  version: 1;
};

const hasValidBase = (value: unknown): value is StoredGameBase & object => {
  if (!value || typeof value !== 'object') return false;

  const game = value as Partial<StoredGameBase>;
  return (
    typeof game.puzzleDate === 'string' &&
    typeof game.puzzleNumber === 'number' &&
    Array.isArray(game.submittedWords) &&
    game.submittedWords.length <= 6 &&
    game.submittedWords.every(word =>
      typeof word === 'string' ? /^[A-Z]{5}$/.test(word) : false
    )
  );
};

const isStoredCarriedLetter = (
  value: unknown
): value is StoredCarriedLetter => {
  if (!value || typeof value !== 'object') return false;

  const member = value as Partial<StoredCarriedLetter>;
  return (
    typeof member.letter === 'string' &&
    /^[A-Z]$/.test(member.letter) &&
    Number.isInteger(member.position) &&
    (member.position ?? -1) >= 0 &&
    (member.position ?? 5) < 5 &&
    ['editable', 'frozen', 'locked'].includes(member.state ?? '')
  );
};

const isStoredGame = (value: unknown): value is StoredGame => {
  if (!hasValidBase(value)) return false;

  const game = value as Partial<StoredGame>;
  if (
    game.version !== STORAGE_VERSION ||
    !Array.isArray(game.carriedLetters) ||
    !game.carriedLetters.every(isStoredCarriedLetter)
  ) {
    return false;
  }

  return (
    new Set(game.carriedLetters.map(member => member.position)).size ===
    game.carriedLetters.length
  );
};

const isLegacyStoredGame = (value: unknown): value is LegacyStoredGame =>
  hasValidBase(value) &&
  (value as Partial<LegacyStoredGame>).version === 1;

export const loadPuzzlePlay = (
  puzzleDefinition: PuzzleDefinition,
  storage: Storage = window.localStorage
): PuzzlePlay | null => {
  const storedValue = storage.getItem(STORAGE_KEY);
  if (!storedValue) return null;

  try {
    const storedGame: unknown = JSON.parse(storedValue);
    if (
      (!isStoredGame(storedGame) && !isLegacyStoredGame(storedGame)) ||
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

    if (
      isStoredGame(storedGame) &&
      puzzlePlay.gameStatus === 'playing'
    ) {
      const currentGuess = puzzlePlay.guesses[puzzlePlay.currentGuessIndex];

      storedGame.carriedLetters.forEach(member => {
        currentGuess.letters[member.position] = {
          isCarried: true,
          isFrozen: member.state === 'frozen' || undefined,
          isLocked: member.state === 'locked' || undefined,
          letter: member.letter,
        };
      });
      currentGuess.word = currentGuess.letters
        .map(member => member.letter)
        .join('');
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
  const currentGuess = puzzlePlay.guesses[puzzlePlay.currentGuessIndex];
  const carriedLetters = (currentGuess?.letters ?? []).reduce<
    StoredCarriedLetter[]
  >((members, member, position) => {
    if (!member.isCarried || !member.letter) return members;

    members.push({
      letter: member.letter,
      position,
      state: member.isLocked
        ? 'locked'
        : member.isFrozen
          ? 'frozen'
          : 'editable',
    });
    return members;
  }, []);

  const storedGame: StoredGame = {
    carriedLetters,
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
