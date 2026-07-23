import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Modal from '.';

describe('statistics modal', () => {
  it('shares the completed result and confirms success', async () => {
    const onShare = vi.fn().mockResolvedValue('copied');
    render(<Modal isOpen onClose={vi.fn()} onShare={onShare} />);

    fireEvent.click(screen.getByRole('button', { name: 'Share results' }));

    expect(await screen.findByText('Results copied to clipboard')).toBeVisible();
    expect(onShare).toHaveBeenCalledOnce();
  });
});
