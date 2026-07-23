import { StoreProvider } from 'easy-peasy';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDefaultSettings,
  createInitialPuzzlePlay,
  store,
} from '../../state/state';
import PuzzleCanvas from './PuzzleCanvas';

const renderPuzzle = () => {
  store.getActions().initialisePuzzle({
    definition: {
      answer: 'SLEEP',
      date: '2026-07-23',
      number: 1860,
    },
    puzzlePlay: createInitialPuzzlePlay(),
    settings: createDefaultSettings(),
  });

  return render(
    <StoreProvider store={store}>
      <PuzzleCanvas />
    </StoreProvider>
  );
};

describe('PuzzleCanvas physical keyboard support', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
  });

  it('enters letters, removes the latest letter, and submits a short row', () => {
    renderPuzzle();

    fireEvent.keyDown(window, { key: 's' });
    fireEvent.keyDown(window, { key: 'L' });

    expect(screen.getByLabelText('1st letter, S')).toBeVisible();
    expect(screen.getByLabelText('2nd letter, L')).toBeVisible();

    fireEvent.keyDown(window, { key: 'Backspace' });

    expect(screen.queryByLabelText('2nd letter, L')).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(screen.getByText('Not enough letters')).toBeVisible();
  });

  it('does not enter game letters while settings are open', () => {
    renderPuzzle();

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.keyDown(window, { key: 'S' });

    expect(screen.queryByLabelText('1st letter, S')).not.toBeInTheDocument();
  });
});
