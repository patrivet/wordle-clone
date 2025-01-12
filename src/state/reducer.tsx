import { useContext, useReducer, createContext } from 'react';

// --- types
export type AppState = {
  puzzleDefinition: PuzzleDefinition;
  puzzlePlay: PuzzlePlay;
};

export type PuzzleDefinition = {
  date: string;
  number: number;
  answer: string;
};
export type PuzzlePlay = {
  guesses: Guess[];
  lettersGrey: string[];
  lettersGreen: string[];
  lettersYellow: string[];
};

export type Guess = {
  status?: GuessStatus; // 'inProgress' | 'rejected' | 'complete';
  letters: GuessLetter[];
  isAnswer?: boolean;
  nextLetterIndex?: number;
};

export type GuessLetter = {
  letter: string;
  status?: GuessLetterStatus; // 'grey' | 'yellow' | 'green';
  isFrozen?: boolean;
  // ? need a state for Letter border too? "No entry"/"entrered_preSubmit"/"Submitted".
};

export type Action =
  | { type: 'PUZZLE_DEFINITION'; payload?: PuzzleDefinition }
  | { type: 'PUZZLE_PLAY'; payload?: PuzzlePlay };

enum GuessStatus {
  InProgress = 'InProgress',
  Rejected = 'Rejected',
  Complete = 'Complete',
}
/* or use: type GuessStatus = 'inProgress' | 'rejected' | 'complete'; */

enum GuessLetterStatus {
  Grey = 'Grey', // ! or Elimitated
  Yellow = 'Yellow', // ! or Hint
  Green = 'Green', // ! or Correct
}
// ! or use: type GuessLetterStatus = 'grey' | 'yellow' | 'green';

// ---- reducers
const appReducer = (state, action) => {
  switch (action.type) {
    case 'PUZZLE_DEFINITION':
      return {
        ...state,
        puzzleDefinition: { ...state.puzzleDefintion, ...action.payload },
      };
    case 'PUZZLE_PLAY':
      return {
        ...state,
        puzzlePlay: { ...state.puzzlePlay, ...action.payload },
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

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
};

const initialState: AppState = {
  puzzleDefinition: {
    date: '',
    number: 0,
    answer: '',
  },
  puzzlePlay: {
    // ? better to have an empty [] here and init 6 empty guesses in the canvas component?
    guesses: Array.from({ length: 6 }, () => ({
      ...emptyGuessTemplate,
      letters: emptyGuessTemplate.letters.map(letter => ({ ...letter }))
    })),
    lettersGrey: [],
    lettersGreen: [],
    lettersYellow: [],
  },
};

// Actions creators
const updatePuzzleDefinition = (foo?: PuzzleDefinition): Action => ({
  type: 'PUZZLE_DEFINITION',
  payload: foo,
});
const updatePuzzlePlay = (foo?: PuzzlePlay): Action => ({
  type: 'PUZZLE_PLAY',
  payload: foo,
});

// ---- contexts
export const AppStateContext = createContext(initialState);
const AppDispatchContext = createContext(null); // shouldn't we have something to initialize the context here instead of null

export const AppProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// custom hooks (reading and updating state)
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppActions = () => {
  const dispatch = useContext(AppDispatchContext);
  if (dispatch === undefined || dispatch === null) {
    throw new Error('useAppActions must be used within an AppProvider');
  }

  return {
    updatePuzzleDefinition: (foo: PuzzleDefinition) =>
      dispatch(updatePuzzleDefinition(foo)),
    updatePuzzlePlay: (foo: PuzzlePlay) => dispatch(updatePuzzlePlay(foo)),
  };
};
