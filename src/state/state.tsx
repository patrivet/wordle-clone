import {
  action,
  createStore,
  createTypedHooks,
  type Action,
} from 'easy-peasy';
import {
  GuessStatus,
  type AppState,
  type AppSettings,
  type Guess,
  type PuzzleDefinition,
  type PuzzlePlay,
} from '../types';
import { mergeLetterStatuses } from '../utils';

export const createEmptyGuess = (): Guess => ({
  letters: Array.from({ length: 5 }, () => ({ letter: '' })),
  status: GuessStatus.InProgress,
  isAnswer: false,
  word: '',
});

export const createInitialPuzzlePlay = (): PuzzlePlay => ({
  guesses: Array.from({ length: 6 }, createEmptyGuess),
  currentGuessIndex: 0,
  letterStatuses: {},
  gameStatus: 'playing',
});

export const createDefaultSettings = (): AppSettings => ({
  frozenLettersPersist: false,
  hardMode: false,
});

type InitialisePuzzlePayload = {
  definition: PuzzleDefinition;
  puzzlePlay: PuzzlePlay;
  settings: AppSettings;
};

export type StoreModel = AppState & {
  setPuzzleLoading: Action<StoreModel>;
  initialisePuzzle: Action<StoreModel, InitialisePuzzlePayload>;
  setPuzzleError: Action<StoreModel, string>;
  enterLetter: Action<StoreModel, string>;
  deleteLetter: Action<StoreModel>;
  toggleFrozenLetter: Action<StoreModel, number>;
  commitGuess: Action<StoreModel, Guess>;
  setFrozenLettersPersist: Action<StoreModel, boolean>;
  setHardMode: Action<StoreModel, boolean>;
};

const model: StoreModel = {
  puzzleDefinition: null,
  puzzlePlay: createInitialPuzzlePlay(),
  puzzleLoadStatus: 'loading',
  puzzleLoadError: null,
  settings: createDefaultSettings(),

  setPuzzleLoading: action(state => {
    state.puzzleLoadStatus = 'loading';
    state.puzzleLoadError = null;
  }),

  initialisePuzzle: action((state, payload) => {
    state.puzzleDefinition = payload.definition;
    state.puzzlePlay = payload.puzzlePlay;
    state.settings = payload.settings;
    state.puzzleLoadStatus = 'ready';
    state.puzzleLoadError = null;
  }),

  setPuzzleError: action((state, message) => {
    state.puzzleLoadStatus = 'error';
    state.puzzleLoadError = message;
  }),

  enterLetter: action((state, letter) => {
    if (state.puzzlePlay.gameStatus !== 'playing') return;

    const guess = state.puzzlePlay.guesses[state.puzzlePlay.currentGuessIndex];
    if (!guess) return;

    const nextLetterIndex = guess.letters.findIndex(
      member => !member.letter && !member.isFrozen
    );
    if (nextLetterIndex < 0) return;

    guess.letters[nextLetterIndex] = { letter: letter.toUpperCase() };
    guess.word = guess.letters.map(member => member.letter).join('');
  }),

  deleteLetter: action(state => {
    if (state.puzzlePlay.gameStatus !== 'playing') return;

    const guess = state.puzzlePlay.guesses[state.puzzlePlay.currentGuessIndex];
    if (!guess) return;

    let letterIndex = -1;
    for (let index = guess.letters.length - 1; index >= 0; index -= 1) {
      const member = guess.letters[index];
      if (member?.letter && !member.isFrozen) {
        letterIndex = index;
        break;
      }
    }
    if (letterIndex < 0) return;

    guess.letters[letterIndex] = { letter: '' };
    guess.word = guess.letters.map(member => member.letter).join('');
  }),

  toggleFrozenLetter: action((state, letterIndex) => {
    if (state.puzzlePlay.gameStatus !== 'playing') return;

    const guess = state.puzzlePlay.guesses[state.puzzlePlay.currentGuessIndex];
    const member = guess?.letters[letterIndex];
    if (!member?.letter) return;

    member.isFrozen = !member.isFrozen;
  }),

  commitGuess: action((state, guess) => {
    const guessIndex = state.puzzlePlay.currentGuessIndex;
    if (guessIndex >= state.puzzlePlay.guesses.length) return;

    state.puzzlePlay.guesses[guessIndex] = guess;
    state.puzzlePlay.letterStatuses = mergeLetterStatuses(
      state.puzzlePlay.letterStatuses,
      guess
    );
    state.puzzlePlay.currentGuessIndex = guessIndex + 1;

    if (guess.isAnswer) {
      state.puzzlePlay.gameStatus = 'won';
    } else if (
      state.puzzlePlay.currentGuessIndex >= state.puzzlePlay.guesses.length
    ) {
      state.puzzlePlay.gameStatus = 'lost';
    } else if (state.settings.frozenLettersPersist) {
      const nextLetters = guess.letters.map(member =>
        member.isFrozen
          ? { letter: member.letter, isFrozen: true }
          : { letter: '' }
      );
      const nextGuess = state.puzzlePlay.guesses[state.puzzlePlay.currentGuessIndex];

      nextGuess.letters = nextLetters;
      nextGuess.word = nextLetters.map(member => member.letter).join('');
    }
  }),

  setFrozenLettersPersist: action((state, frozenLettersPersist) => {
    state.settings.frozenLettersPersist = frozenLettersPersist;
  }),

  setHardMode: action((state, hardMode) => {
    if (state.puzzlePlay.currentGuessIndex > 0) return;
    state.settings.hardMode = hardMode;
  }),
};

export const store = createStore<StoreModel>(model);

const typedHooks = createTypedHooks<StoreModel>();

export const useAppStoreActions = typedHooks.useStoreActions;
export const useAppStoreState = typedHooks.useStoreState;
