import { describe, expect, it } from 'vitest';
import { GuessStatus, type Guess, type PuzzleDefinition } from './types';
import { analyseGuess, mergeLetterStatuses } from './utils';

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

describe('analyseGuess', () => {
  it('does not mark surplus duplicate letters as present', () => {
    const result = analyseGuess(makeGuess('EERIE'), puzzleDefinition);

    expect(result.letters.map(letter => letter.status)).toEqual([
      'yellow',
      'yellow',
      'grey',
      'grey',
      'grey',
    ]);
  });

  it('marks an exact answer as complete', () => {
    const result = analyseGuess(makeGuess('SLEEP'), puzzleDefinition);

    expect(result.isAnswer).toBe(true);
    expect(result.status).toBe(GuessStatus.Complete);
    expect(result.letters.every(letter => letter.status === 'green')).toBe(true);
  });
});

describe('mergeLetterStatuses', () => {
  it('does not downgrade a known letter status', () => {
    const result = mergeLetterStatuses(
      { E: 'yellow', S: 'green' },
      {
        ...makeGuess('EERIE'),
        letters: [
          { letter: 'E', status: 'grey' },
          { letter: 'E', status: 'green' },
          { letter: 'R', status: 'grey' },
          { letter: 'I', status: 'grey' },
          { letter: 'E', status: 'grey' },
        ],
      }
    );

    expect(result.E).toBe('green');
    expect(result.S).toBe('green');
    expect(result.R).toBe('grey');
  });
});
