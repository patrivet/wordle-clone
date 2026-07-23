import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SettingsModal from './SettingsModal';

describe('SettingsModal', () => {
  it('changes hard mode before the game has started', () => {
    const onHardModeChange = vi.fn();
    render(
      <SettingsModal
        hardMode={false}
        hardModeLocked={false}
        onClose={vi.fn()}
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
        hardMode
        hardModeLocked
        onClose={vi.fn()}
        onHardModeChange={vi.fn()}
        puzzleNumber={1859}
      />
    );

    expect(screen.getByRole('switch', { name: 'Hard Mode' })).toBeDisabled();
  });
});
