import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialPuzzlePlay } from '../state/state';
import { GuessStatus, type Guess, type PuzzleDefinition } from '../types';
import { analyseGuess, mergeLetterStatuses } from '../utils';
import { loadPuzzlePlay, savePuzzlePlay } from './gameStorage';

const puzzleDefinition: PuzzleDefinition = {
  answer: 'SLEEP',
  date: '2026-07-22',
  number: 1859,
};

const makeGuess = (word: string): Guess => ({
  isAnswer: false,
  letters: [...word].map(letter => ({ letter })),
  status: GuessStatus.InProgress,
  word,
});

beforeEach(() => {
  window.localStorage.clear();
});

describe('game storage', () => {
  it('persists submitted words without a partially typed row', () => {
    const puzzlePlay = createInitialPuzzlePlay();
    const submittedGuess = analyseGuess(makeGuess('STARE'), puzzleDefinition);
    puzzlePlay.guesses[0] = submittedGuess;
    puzzlePlay.guesses[1] = {
      ...puzzlePlay.guesses[1],
      letters: [{ letter: 'S' }, { letter: 'L' }, { letter: '' }, { letter: '' }, { letter: '' }],
      word: 'SL',
    };
    puzzlePlay.currentGuessIndex = 1;
    puzzlePlay.letterStatuses = mergeLetterStatuses({}, submittedGuess);

    savePuzzlePlay(puzzleDefinition, puzzlePlay);

    expect(JSON.parse(window.localStorage.getItem('wordle-clone:game') ?? '')).toEqual({
      carriedLetters: [],
      puzzleDate: '2026-07-22',
      puzzleNumber: 1859,
      submittedWords: ['STARE'],
      version: 2,
    });
  });

  it('rebuilds evaluated guesses and keyboard state', () => {
    window.localStorage.setItem(
      'wordle-clone:game',
      JSON.stringify({
        puzzleDate: '2026-07-22',
        puzzleNumber: 1859,
        submittedWords: ['STARE'],
        version: 1,
      })
    );

    const restored = loadPuzzlePlay(puzzleDefinition);

    expect(restored?.currentGuessIndex).toBe(1);
    expect(restored?.guesses[0].status).toBe(GuessStatus.Complete);
    expect(restored?.letterStatuses.S).toBe('green');
    expect(restored?.letterStatuses.E).toBe('yellow');
  });

  it('restores carried letters without restoring manually typed letters', () => {
    const puzzlePlay = createInitialPuzzlePlay();
    const submittedGuess = analyseGuess(makeGuess('STARE'), puzzleDefinition);
    puzzlePlay.guesses[0] = submittedGuess;
    puzzlePlay.guesses[1] = {
      ...puzzlePlay.guesses[1],
      letters: [
        { isCarried: true, letter: 'S' },
        { isCarried: true, isFrozen: true, letter: 'L' },
        { letter: 'A' },
        { isCarried: true, isLocked: true, letter: 'E' },
        { letter: '' },
      ],
      word: 'SLAE',
    };
    puzzlePlay.currentGuessIndex = 1;
    puzzlePlay.letterStatuses = mergeLetterStatuses({}, submittedGuess);

    savePuzzlePlay(puzzleDefinition, puzzlePlay);

    expect(
      JSON.parse(window.localStorage.getItem('wordle-clone:game') ?? '')
        .carriedLetters
    ).toEqual([
      { letter: 'S', position: 0, state: 'editable' },
      { letter: 'L', position: 1, state: 'frozen' },
      { letter: 'E', position: 3, state: 'locked' },
    ]);

    const restored = loadPuzzlePlay(puzzleDefinition);

    expect(restored?.guesses[1].letters).toEqual([
      { isCarried: true, isFrozen: undefined, isLocked: undefined, letter: 'S' },
      { isCarried: true, isFrozen: true, isLocked: undefined, letter: 'L' },
      { letter: '' },
      { isCarried: true, isFrozen: undefined, isLocked: true, letter: 'E' },
      { letter: '' },
    ]);
    expect(restored?.guesses[1].word).toBe('SLE');
  });

  it('discards state from another daily puzzle', () => {
    window.localStorage.setItem(
      'wordle-clone:game',
      JSON.stringify({
        puzzleDate: '2026-07-21',
        puzzleNumber: 1858,
        submittedWords: ['STARE'],
        version: 1,
      })
    );

    expect(loadPuzzlePlay(puzzleDefinition)).toBeNull();
    expect(window.localStorage.getItem('wordle-clone:game')).toBeNull();
  });
});
