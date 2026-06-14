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
  currentGuessIndex: number; // active row
  letterStatuses: {};
  // isGameComplete: boolean;
};

export type Guess = {
  status?: GuessStatus; // 'inProgress' | 'rejected' | 'complete';
  letters: GuessLetter[];
  word?: string;
  isAnswer?: boolean;
  // ! TODO: not sure we need this? nextLetterIndex?: number;
};

export type GuessLetter = {
  letter: string;
  // status?: GuessLetterStatus; // 'grey' | 'yellow' | 'green'; OR undefined (not yet processed?)
  status?: 'grey' | 'yellow' | 'green';
  isFrozen?: boolean;
  // ? need a state for Letter border too? "No entry"/"entrered_preSubmit"/"Submitted".
};

export type Action =
  | { type: 'PUZZLE_DEFINITION'; payload?: PuzzleDefinition }
  | { type: 'PUZZLE_PLAY'; payload?: PuzzlePlay };

export enum GuessStatus {
  InProgress = 'InProgress',
  Rejected = 'Rejected',
  Complete = 'Complete',
}
/* or use: type GuessStatus = 'inProgress' | 'rejected' | 'complete'; */
