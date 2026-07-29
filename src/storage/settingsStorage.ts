import { createDefaultSettings } from '../state/state';
import type { AppSettings } from '../types';

const STORAGE_KEY = 'wordle-clone:settings';
const STORAGE_VERSION = 3;

type StoredSettings = AppSettings & {
  version: typeof STORAGE_VERSION;
};

type VersionOneStoredSettings = Pick<AppSettings, 'hardMode'> & {
  version: 1;
};

type VersionTwoStoredSettings = Pick<
  AppSettings,
  'frozenLettersPersist' | 'hardMode'
> & {
  version: 2;
};

const isVersionOneStoredSettings = (
  value: unknown
): value is VersionOneStoredSettings => {
  if (!value || typeof value !== 'object') return false;

  const settings = value as Partial<VersionOneStoredSettings>;
  return settings.version === 1 && typeof settings.hardMode === 'boolean';
};

const isVersionTwoStoredSettings = (
  value: unknown
): value is VersionTwoStoredSettings => {
  if (!value || typeof value !== 'object') return false;

  const settings = value as Partial<VersionTwoStoredSettings>;
  return (
    settings.version === 2 &&
    typeof settings.frozenLettersPersist === 'boolean' &&
    typeof settings.hardMode === 'boolean'
  );
};

const isStoredSettings = (value: unknown): value is StoredSettings => {
  if (!value || typeof value !== 'object') return false;

  const settings = value as Partial<StoredSettings>;
  return (
    settings.version === STORAGE_VERSION &&
    ['off', 'editable', 'frozen', 'locked'].includes(
      settings.autoFillGreenLetters ?? ''
    ) &&
    typeof settings.frozenLettersPersist === 'boolean' &&
    typeof settings.hardMode === 'boolean'
  );
};

export const loadSettings = (
  storage: Storage = window.localStorage
): AppSettings => {
  const storedValue = storage.getItem(STORAGE_KEY);
  if (!storedValue) return createDefaultSettings();

  try {
    const storedSettings: unknown = JSON.parse(storedValue);
    if (!isStoredSettings(storedSettings)) {
      if (isVersionTwoStoredSettings(storedSettings)) {
        return {
          ...createDefaultSettings(),
          frozenLettersPersist: storedSettings.frozenLettersPersist,
          hardMode: storedSettings.hardMode,
        };
      }

      if (isVersionOneStoredSettings(storedSettings)) {
        return {
          ...createDefaultSettings(),
          hardMode: storedSettings.hardMode,
        };
      }

      storage.removeItem(STORAGE_KEY);
      return createDefaultSettings();
    }

    return {
      autoFillGreenLetters: storedSettings.autoFillGreenLetters,
      frozenLettersPersist: storedSettings.frozenLettersPersist,
      hardMode: storedSettings.hardMode,
    };
  } catch {
    storage.removeItem(STORAGE_KEY);
    return createDefaultSettings();
  }
};

export const saveSettings = (
  settings: AppSettings,
  storage: Storage = window.localStorage
): void => {
  const storedSettings: StoredSettings = {
    version: STORAGE_VERSION,
    ...settings,
  };

  storage.setItem(STORAGE_KEY, JSON.stringify(storedSettings));
};
