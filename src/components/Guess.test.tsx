import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GuessStatus, type Guess as GuessType } from '../types';
import Guess from './Guess';

const baseGuess: GuessType = {
  isAnswer: false,
  letters: [
    { letter: 'S' },
    { letter: '' },
    { letter: '' },
    { letter: '' },
    { letter: '' },
  ],
  status: GuessStatus.InProgress,
  word: 'S',
};

describe('Guess', () => {
  it('marks newly entered tiles for the pop animation', () => {
    render(
      <Guess
        guess={baseGuess}
        index={0}
        invalidAnimationKey={0}
        isCurrent
        isInvalid={false}
        isRevealing={false}
        isWinning={false}
      />
    );

    expect(screen.getByLabelText('1st letter, S')).toHaveAttribute(
      'data-animation',
      'pop'
    );
  });

  it('exposes evaluated tile state during the reveal', () => {
    render(
      <Guess
        guess={{
          ...baseGuess,
          letters: baseGuess.letters.map((letter, index) => ({
            ...letter,
            status: index === 0 ? 'green' : 'grey',
          })),
        }}
        index={0}
        invalidAnimationKey={0}
        isCurrent={false}
        isInvalid={false}
        isRevealing
        isWinning={false}
      />
    );

    expect(screen.getByLabelText('1st letter, S, correct')).toHaveAttribute(
      'data-animation',
      'flip'
    );
    expect(screen.getByLabelText('1st letter, S, correct')).toHaveAttribute(
      'data-state',
      'green'
    );
  });
});
