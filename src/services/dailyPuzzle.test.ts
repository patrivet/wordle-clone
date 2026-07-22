import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchDailyPuzzle, formatPuzzleDate } from './dailyPuzzle';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('formatPuzzleDate', () => {
  it('uses the browser-local calendar date', () => {
    expect(formatPuzzleDate(new Date(2026, 6, 2, 23, 59))).toBe('2026-07-02');
  });
});

describe('fetchDailyPuzzle', () => {
  it('maps and normalises the NYT response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        days_since_launch: 1859,
        print_date: '2026-07-22',
        solution: 'lorry',
      }),
      ok: true,
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchDailyPuzzle('2026-07-22')).resolves.toEqual({
      answer: 'LORRY',
      date: '2026-07-22',
      number: 1859,
    });
    expect(fetchMock).toHaveBeenCalledWith('/api/wordle/2026-07-22.json', {
      headers: { Accept: 'application/json' },
      signal: undefined,
    });
  });

  it('rejects an unexpected response shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ solution: 'too-long' }),
        ok: true,
      })
    );

    await expect(fetchDailyPuzzle('2026-07-22')).rejects.toThrow(
      'Daily puzzle response was not in the expected format'
    );
  });
});
