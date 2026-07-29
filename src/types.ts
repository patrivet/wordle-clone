export type LetterStatus = 'grey' | 'yellow' | 'green';

export type GameStatus = 'playing' | 'won' | 'lost';

export type PuzzleLoadStatus = 'loading' | 'ready' | 'error';

export type AutoFillGreenLettersMode =
  | 'off'
  | 'editable'
  | 'frozen'
  | 'locked';

export type AppState = {
  puzzleDefinition: PuzzleDefinition | null;
  puzzlePlay: PuzzlePlay;
  puzzleLoadStatus: PuzzleLoadStatus;
  puzzleLoadError: string | null;
  settings: AppSettings;
};

export type AppSettings = {
  autoFillGreenLetters: AutoFillGreenLettersMode;
  frozenLettersPersist: boolean;
  hardMode: boolean;
};

export type PuzzleDefinition = {
  date: string;
  number: number;
  answer: string;
};

export type PuzzlePlay = {
  guesses: Guess[];
  currentGuessIndex: number;
  letterStatuses: Record<string, LetterStatus>;
  gameStatus: GameStatus;
};

export type Guess = {
  status: GuessStatus;
  letters: GuessLetter[];
  word: string;
  isAnswer: boolean;
};

export type GuessLetter = {
  letter: string;
  status?: LetterStatus;
  isCarried?: boolean;
  isFrozen?: boolean;
  isLocked?: boolean;
};

export enum GuessStatus {
  InProgress = 'InProgress',
  Rejected = 'Rejected',
  Complete = 'Complete',
}
