import type { PuzzleDefinition } from '../types';

type NytWordleResponse = {
  solution: string;
  print_date: string;
  days_since_launch: number;
};

export const formatPuzzleDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isNytWordleResponse = (value: unknown): value is NytWordleResponse => {
  if (!value || typeof value !== 'object') return false;

  const response = value as Partial<NytWordleResponse>;
  return (
    typeof response.solution === 'string' &&
    /^[a-z]{5}$/i.test(response.solution) &&
    typeof response.print_date === 'string' &&
    typeof response.days_since_launch === 'number'
  );
};

export const fetchDailyPuzzle = async (
  date: string = formatPuzzleDate(),
  signal?: AbortSignal
): Promise<PuzzleDefinition> => {
  const response = await fetch(`/api/wordle/${date}.json`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Daily puzzle request failed with status ${response.status}`);
  }

  const responseBody: unknown = await response.json();
  if (!isNytWordleResponse(responseBody)) {
    throw new Error('Daily puzzle response was not in the expected format');
  }

  const answerOverride = import.meta.env.VITE_WORDLE_ANSWER?.trim().toUpperCase();
  if (answerOverride && !/^[A-Z]{5}$/.test(answerOverride)) {
    throw new Error('VITE_WORDLE_ANSWER must contain exactly five letters');
  }

  return {
    date: responseBody.print_date,
    number: responseBody.days_since_launch,
    answer: answerOverride || responseBody.solution.toUpperCase(),
  };
};
