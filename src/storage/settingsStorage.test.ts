import { beforeEach, describe, expect, it } from 'vitest';
import { loadSettings, saveSettings } from './settingsStorage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('settings storage', () => {
  it('uses normal mode when no settings have been stored', () => {
    expect(loadSettings()).toEqual({
      frozenLettersPersist: false,
      hardMode: false,
    });
  });

  it('persists preferences independently of a puzzle', () => {
    saveSettings({ frozenLettersPersist: true, hardMode: true });

    expect(loadSettings()).toEqual({
      frozenLettersPersist: true,
      hardMode: true,
    });
    expect(
      JSON.parse(window.localStorage.getItem('wordle-clone:settings') ?? '')
    ).toEqual({
      frozenLettersPersist: true,
      hardMode: true,
      version: 2,
    });
  });

  it('preserves a hard-mode preference from version one', () => {
    window.localStorage.setItem(
      'wordle-clone:settings',
      JSON.stringify({ hardMode: true, version: 1 })
    );

    expect(loadSettings()).toEqual({
      frozenLettersPersist: false,
      hardMode: true,
    });
  });

  it('discards malformed settings', () => {
    window.localStorage.setItem(
      'wordle-clone:settings',
      JSON.stringify({ hardMode: 'yes', version: 1 })
    );

    expect(loadSettings()).toEqual({
      frozenLettersPersist: false,
      hardMode: false,
    });
    expect(window.localStorage.getItem('wordle-clone:settings')).toBeNull();
  });
});
