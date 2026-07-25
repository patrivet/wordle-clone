import { beforeEach, describe, expect, it } from 'vitest';
import { analyseGuess } from '../utils';
import {
  createDefaultSettings,
  createInitialPuzzlePlay,
  store,
} from './state';

const definition = {
  answer: 'SLEEP',
  date: '2026-07-25',
  number: 1862,
};

beforeEach(() => {
  store.getActions().initialisePuzzle({
    definition,
    puzzlePlay: createInitialPuzzlePlay(),
    settings: createDefaultSettings(),
  });
});

describe('frozen letter state', () => {
  it('keeps frozen letters while entry and deletion skip their positions', () => {
    const actions = store.getActions();

    actions.enterLetter('S');
    actions.enterLetter('L');
    actions.enterLetter('E');
    actions.toggleFrozenLetter(1);
    actions.deleteLetter();
    actions.deleteLetter();
    actions.enterLetter('A');
    actions.enterLetter('R');

    expect(store.getState().puzzlePlay.guesses[0].letters).toEqual([
      { letter: 'A' },
      { isFrozen: true, letter: 'L' },
      { letter: 'R' },
      { letter: '' },
      { letter: '' },
    ]);
  });

  it('carries frozen positions into the next row when enabled', () => {
    const actions = store.getActions();
    actions.setFrozenLettersPersist(true);
    [...'STARE'].forEach(actions.enterLetter);
    actions.toggleFrozenLetter(0);
    actions.toggleFrozenLetter(2);

    const currentGuess = store.getState().puzzlePlay.guesses[0];
    actions.commitGuess(analyseGuess(currentGuess, definition));

    expect(store.getState().puzzlePlay.currentGuessIndex).toBe(1);
    expect(store.getState().puzzlePlay.guesses[1].letters).toEqual([
      { isFrozen: true, letter: 'S' },
      { letter: '' },
      { isFrozen: true, letter: 'A' },
      { letter: '' },
      { letter: '' },
    ]);
  });

  it('starts the next row empty when persistence is disabled', () => {
    const actions = store.getActions();
    [...'STARE'].forEach(actions.enterLetter);
    actions.toggleFrozenLetter(0);

    const currentGuess = store.getState().puzzlePlay.guesses[0];
    actions.commitGuess(analyseGuess(currentGuess, definition));

    expect(store.getState().puzzlePlay.guesses[1].letters).toEqual([
      { letter: '' },
      { letter: '' },
      { letter: '' },
      { letter: '' },
      { letter: '' },
    ]);
  });
});
