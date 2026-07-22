import { createDefaultSettings } from '../state/state';
import type { AppSettings } from '../types';

const STORAGE_KEY = 'wordle-clone:settings';
const STORAGE_VERSION = 1;

type StoredSettings = AppSettings & {
  version: number;
};

const isStoredSettings = (value: unknown): value is StoredSettings => {
  if (!value || typeof value !== 'object') return false;

  const settings = value as Partial<StoredSettings>;
  return settings.version === STORAGE_VERSION && typeof settings.hardMode === 'boolean';
};

export const loadSettings = (
  storage: Storage = window.localStorage
): AppSettings => {
  const storedValue = storage.getItem(STORAGE_KEY);
  if (!storedValue) return createDefaultSettings();

  try {
    const storedSettings: unknown = JSON.parse(storedValue);
    if (!isStoredSettings(storedSettings)) {
      storage.removeItem(STORAGE_KEY);
      return createDefaultSettings();
    }

    return { hardMode: storedSettings.hardMode };
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
