import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

const renderGuess = (
  guess: GuessType = baseGuess,
  onToggleFreeze = vi.fn()
) => {
  render(
    <Guess
      freezeDisabled={false}
      guess={guess}
      index={0}
      invalidAnimationKey={0}
      isCurrent
      isInvalid={false}
      isRevealing={false}
      isWinning={false}
      onToggleFreeze={onToggleFreeze}
    />
  );

  return onToggleFreeze;
};

afterEach(() => {
  vi.useRealTimers();
});

describe('Guess', () => {
  it('marks newly entered tiles for the pop animation', () => {
    renderGuess();

    expect(screen.getByLabelText('1st letter, S')).toHaveAttribute(
      'data-animation',
      'pop'
    );
  });

  it('exposes evaluated tile state during the reveal', () => {
    render(
      <Guess
        freezeDisabled
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
        onToggleFreeze={vi.fn()}
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

  it('toggles a populated tile after a short hold', () => {
    vi.useFakeTimers();
    const onToggleFreeze = renderGuess();
    const tile = screen.getByRole('button', { name: '1st letter, S' });

    const pointerDownAccepted = fireEvent.pointerDown(tile, {
      button: 0,
      isPrimary: true,
    });
    expect(pointerDownAccepted).toBe(false);
    vi.advanceTimersByTime(499);
    expect(onToggleFreeze).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    fireEvent.pointerUp(tile);
    expect(onToggleFreeze).toHaveBeenCalledWith(0);
  });

  it('cancels the hold when the pointer interaction is cancelled', () => {
    vi.useFakeTimers();
    const onToggleFreeze = renderGuess();
    const tile = screen.getByRole('button', { name: '1st letter, S' });

    fireEvent.pointerDown(tile, { button: 0, isPrimary: true });
    vi.advanceTimersByTime(200);
    fireEvent.pointerCancel(tile);
    vi.advanceTimersByTime(300);

    expect(onToggleFreeze).not.toHaveBeenCalled();
  });

  it('exposes frozen state and supports keyboard activation', () => {
    const onToggleFreeze = renderGuess({
      ...baseGuess,
      letters: [
        { letter: 'S', isFrozen: true },
        { letter: '' },
        { letter: '' },
        { letter: '' },
        { letter: '' },
      ],
    });
    const tile = screen.getByRole('button', {
      name: '1st letter, S, frozen. Hold to unfreeze',
    });

    expect(tile).toHaveAttribute('aria-pressed', 'true');
    expect(tile).toHaveAttribute('data-state', 'frozen');

    fireEvent.click(tile, { detail: 0 });
    expect(onToggleFreeze).toHaveBeenCalledWith(0);
  });
});
