import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SettingsModal from './SettingsModal';

describe('SettingsModal', () => {
  it('changes hard mode before the game has started', () => {
    const onHardModeChange = vi.fn();
    render(
      <SettingsModal
        autoFillGreenLetters="off"
        frozenLettersPersist={false}
        hardMode={false}
        hardModeLocked={false}
        onClose={vi.fn()}
        onAutoFillGreenLettersChange={vi.fn()}
        onFrozenLettersPersistChange={vi.fn()}
        onHardModeChange={onHardModeChange}
        puzzleNumber={1859}
      />
    );

    const hardModeSwitch = screen.getByRole('switch', { name: 'Hard Mode' });
    expect(hardModeSwitch).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(hardModeSwitch);
    expect(onHardModeChange).toHaveBeenCalledWith(true);
  });

  it('locks hard mode after a guess has been submitted', () => {
    render(
      <SettingsModal
        autoFillGreenLetters="off"
        frozenLettersPersist={false}
        hardMode
        hardModeLocked
        onClose={vi.fn()}
        onAutoFillGreenLettersChange={vi.fn()}
        onFrozenLettersPersistChange={vi.fn()}
        onHardModeChange={vi.fn()}
        puzzleNumber={1859}
      />
    );

    expect(screen.getByRole('switch', { name: 'Hard Mode' })).toBeDisabled();
  });

  it('changes whether frozen letters carry into the next guess', () => {
    const onFrozenLettersPersistChange = vi.fn();
    render(
      <SettingsModal
        autoFillGreenLetters="off"
        frozenLettersPersist={false}
        hardMode={false}
        hardModeLocked={false}
        onClose={vi.fn()}
        onAutoFillGreenLettersChange={vi.fn()}
        onFrozenLettersPersistChange={onFrozenLettersPersistChange}
        onHardModeChange={vi.fn()}
        puzzleNumber={1859}
      />
    );

    const persistSwitch = screen.getByRole('switch', {
      name: 'Frozen letters persist',
    });
    expect(persistSwitch).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(persistSwitch);
    expect(onFrozenLettersPersistChange).toHaveBeenCalledWith(true);
  });

  it('selects one auto-fill behaviour', () => {
    const onAutoFillGreenLettersChange = vi.fn();
    render(
      <SettingsModal
        autoFillGreenLetters="off"
        frozenLettersPersist={false}
        hardMode={false}
        hardModeLocked={false}
        onAutoFillGreenLettersChange={onAutoFillGreenLettersChange}
        onClose={vi.fn()}
        onFrozenLettersPersistChange={vi.fn()}
        onHardModeChange={vi.fn()}
        puzzleNumber={1859}
      />
    );

    const group = screen.getByRole('group', {
      name: 'Auto-fill green letters',
    });
    expect(group).toBeVisible();
    expect(screen.getByRole('radio', { name: /Off/ })).toBeChecked();

    fireEvent.click(screen.getByRole('radio', { name: /Locked/ }));
    expect(onAutoFillGreenLettersChange).toHaveBeenCalledWith('locked');
  });
});
