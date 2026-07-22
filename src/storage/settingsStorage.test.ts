import { beforeEach, describe, expect, it } from 'vitest';
import { loadSettings, saveSettings } from './settingsStorage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('settings storage', () => {
  it('uses normal mode when no settings have been stored', () => {
    expect(loadSettings()).toEqual({ hardMode: false });
  });

  it('persists the hard-mode preference independently of a puzzle', () => {
    saveSettings({ hardMode: true });

    expect(loadSettings()).toEqual({ hardMode: true });
    expect(
      JSON.parse(window.localStorage.getItem('wordle-clone:settings') ?? '')
    ).toEqual({ hardMode: true, version: 1 });
  });

  it('discards malformed settings', () => {
    window.localStorage.setItem(
      'wordle-clone:settings',
      JSON.stringify({ hardMode: 'yes', version: 1 })
    );

    expect(loadSettings()).toEqual({ hardMode: false });
    expect(window.localStorage.getItem('wordle-clone:settings')).toBeNull();
  });
});
