import { createDefaultSettings } from '../state/state';
import type { AppSettings } from '../types';

const STORAGE_KEY = 'wordle-clone:settings';
const STORAGE_VERSION = 2;

type StoredSettings = AppSettings & {
  version: typeof STORAGE_VERSION;
};

type LegacyStoredSettings = Pick<AppSettings, 'hardMode'> & {
  version: 1;
};

const isLegacyStoredSettings = (
  value: unknown
): value is LegacyStoredSettings => {
  if (!value || typeof value !== 'object') return false;

  const settings = value as Partial<LegacyStoredSettings>;
  return settings.version === 1 && typeof settings.hardMode === 'boolean';
};

const isStoredSettings = (value: unknown): value is StoredSettings => {
  if (!value || typeof value !== 'object') return false;

  const settings = value as Partial<StoredSettings>;
  return (
    settings.version === STORAGE_VERSION &&
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
      if (isLegacyStoredSettings(storedSettings)) {
        return {
          ...createDefaultSettings(),
          hardMode: storedSettings.hardMode,
        };
      }

      storage.removeItem(STORAGE_KEY);
      return createDefaultSettings();
    }

    return {
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
