import { beforeEach, describe, expect, it } from 'vitest';
import { loadSettings, saveSettings } from './settingsStorage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('settings storage', () => {
  it('uses normal mode when no settings have been stored', () => {
    expect(loadSettings()).toEqual({
      autoFillGreenLetters: 'off',
      frozenLettersPersist: false,
      hardMode: false,
    });
  });

  it('persists preferences independently of a puzzle', () => {
    saveSettings({
      autoFillGreenLetters: 'locked',
      frozenLettersPersist: true,
      hardMode: true,
    });

    expect(loadSettings()).toEqual({
      autoFillGreenLetters: 'locked',
      frozenLettersPersist: true,
      hardMode: true,
    });
    expect(
      JSON.parse(window.localStorage.getItem('wordle-clone:settings') ?? '')
    ).toEqual({
      autoFillGreenLetters: 'locked',
      frozenLettersPersist: true,
      hardMode: true,
      version: 3,
    });
  });

  it('preserves version two preferences with auto-fill disabled', () => {
    window.localStorage.setItem(
      'wordle-clone:settings',
      JSON.stringify({
        frozenLettersPersist: true,
        hardMode: true,
        version: 2,
      })
    );

    expect(loadSettings()).toEqual({
      autoFillGreenLetters: 'off',
      frozenLettersPersist: true,
      hardMode: true,
    });
  });

  it('preserves a hard-mode preference from version one', () => {
    window.localStorage.setItem(
      'wordle-clone:settings',
      JSON.stringify({ hardMode: true, version: 1 })
    );

    expect(loadSettings()).toEqual({
      autoFillGreenLetters: 'off',
      frozenLettersPersist: false,
      hardMode: true,
    });
  });

  it('discards malformed settings', () => {
    window.localStorage.setItem(
      'wordle-clone:settings',
      JSON.stringify({
        autoFillGreenLetters: 'sometimes',
        frozenLettersPersist: false,
        hardMode: false,
        version: 3,
      })
    );

    expect(loadSettings()).toEqual({
      autoFillGreenLetters: 'off',
      frozenLettersPersist: false,
      hardMode: false,
    });
    expect(window.localStorage.getItem('wordle-clone:settings')).toBeNull();
  });
});
