import { action, computed, createStore } from 'easy-peasy';
import { GuessStatus, AppState } from '../types';

// ---- state
const emptyGuessTemplate = {
  letters: [
    { letter: '' },
    { letter: '' },
    { letter: '' },
    { letter: '' },
    { letter: '' },
  ],
  status: GuessStatus.InProgress,
  isAnswer: false,
  nextLetterIndex: 0,
  word: '',
};

const initialState: AppState = {
  puzzleDefinition: {
    date: '',
    number: 0,
    answer: 'SLEEP', // TODO: using a hard coded word to test.
  },
  puzzlePlay: {
    // ? better to have an empty [] here and init 6 empty guesses in the canvas component?
    guesses: Array.from({ length: 6 }, () => ({
      ...emptyGuessTemplate,
      letters: emptyGuessTemplate.letters.map(letter => ({ ...letter })),
    })),
    activeRow: 0, // 0 indexed - 1-5
    letterStatuses: {},
    // isGameComplete: computed(
    //   state => state.puzzlePlay?.guesses.length
    //   // state.puzzlePlay?.guesses?.some(mem => mem.isAnswer)
    // ),
    // ! above doesn't work
  },
};

export const store = createStore({
  ...initialState,
  updatePuzzlePlay: action((state, payload) => {
    state.puzzlePlay = payload;
  }),
});
