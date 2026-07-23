import { describe, expect, it } from 'vitest';
import { GuessStatus, type Guess, type PuzzleDefinition } from './types';
import {
  analyseGuess,
  buildShareText,
  getHardModeViolation,
  mergeLetterStatuses,
} from './utils';

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

describe('getHardModeViolation', () => {
  it('requires green letters to stay in their revealed positions', () => {
    const previousGuess = analyseGuess(makeGuess('STARE'), puzzleDefinition);

    expect(getHardModeViolation('CRANE', [previousGuess])).toBe(
      '1st letter must be S'
    );
  });

  it('requires yellow letters to be reused', () => {
    const previousGuess = analyseGuess(makeGuess('STARE'), puzzleDefinition);

    expect(getHardModeViolation('SHOUT', [previousGuess])).toBe(
      'Guess must contain E'
    );
  });

  it('preserves the revealed minimum for duplicate letters', () => {
    const previousGuess: Guess = {
      ...makeGuess('EERIE'),
      letters: [
        { letter: 'E', status: 'yellow' },
        { letter: 'E', status: 'yellow' },
        { letter: 'R', status: 'grey' },
        { letter: 'I', status: 'grey' },
        { letter: 'E', status: 'grey' },
      ],
      status: GuessStatus.Complete,
    };

    expect(getHardModeViolation('SHARE', [previousGuess])).toBe(
      "Guess must contain 2 E's"
    );
  });

  it('accepts a guess that uses every revealed hint', () => {
    const previousGuess = analyseGuess(makeGuess('STARE'), puzzleDefinition);

    expect(getHardModeViolation('SHEEP', [previousGuess])).toBeNull();
  });
});

describe('buildShareText', () => {
  it('formats a hard-mode result without revealing the answer', () => {
    const firstGuess = analyseGuess(makeGuess('STARE'), puzzleDefinition);
    const winningGuess = analyseGuess(makeGuess('SLEEP'), puzzleDefinition);

    expect(
      buildShareText(
        puzzleDefinition,
        {
          currentGuessIndex: 2,
          gameStatus: 'won',
          guesses: [
            firstGuess,
            winningGuess,
            makeGuess(''),
            makeGuess(''),
            makeGuess(''),
            makeGuess(''),
          ],
          letterStatuses: {},
        },
        true
      )
    ).toBe('Wordle 1,859 2/6*\n\n🟩⬛⬛⬛🟨\n🟩🟩🟩🟩🟩');
  });
});
