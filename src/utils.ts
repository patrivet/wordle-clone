import {
  GuessStatus,
  type Guess,
  type GuessLetter,
  type LetterStatus,
  type PuzzleDefinition,
  type PuzzlePlay,
} from './types';

const STATUS_PRIORITY: Record<LetterStatus, number> = {
  grey: 0,
  yellow: 1,
  green: 2,
};

export const analyseGuess = (
  guess: Guess,
  puzzleDefinition: PuzzleDefinition
): Guess => {
  const answer = puzzleDefinition.answer.toUpperCase();
  const letters: GuessLetter[] = guess.letters.map(member => ({
    letter: member.letter.toUpperCase(),
    isFrozen: member.isFrozen || undefined,
  }));
  const consumedAnswerLetters = Array.from({ length: answer.length }, () => false);

  letters.forEach((member, index) => {
    if (member.letter === answer[index]) {
      member.status = 'green';
      consumedAnswerLetters[index] = true;
    }
  });

  letters.forEach(member => {
    if (member.status) return;

    const answerIndex = [...answer].findIndex(
      (answerLetter, index) =>
        !consumedAnswerLetters[index] && answerLetter === member.letter
    );

    if (answerIndex >= 0) {
      member.status = 'yellow';
      consumedAnswerLetters[answerIndex] = true;
    } else {
      member.status = 'grey';
    }
  });

  const isAnswer = letters.every(member => member.status === 'green');

  return {
    ...guess,
    letters,
    word: letters.map(member => member.letter).join(''),
    status: GuessStatus.Complete,
    isAnswer,
  };
};

export const mergeLetterStatuses = (
  currentStatuses: Record<string, LetterStatus>,
  guess: Guess
): Record<string, LetterStatus> =>
  guess.letters.reduce<Record<string, LetterStatus>>(
    (statuses, member) => {
      if (!member.status) return statuses;

      const currentStatus = statuses[member.letter];
      if (
        !currentStatus ||
        STATUS_PRIORITY[member.status] > STATUS_PRIORITY[currentStatus]
      ) {
        statuses[member.letter] = member.status;
      }

      return statuses;
    },
    { ...currentStatuses }
  );

const ordinal = (position: number): string => {
  const ordinals = ['1st', '2nd', '3rd', '4th', '5th'];
  return ordinals[position] ?? `${position + 1}th`;
};

export const getHardModeViolation = (
  word: string,
  completedGuesses: Guess[]
): string | null => {
  const requiredPositions = new Map<number, string>();
  const minimumLetterCounts = new Map<string, number>();

  completedGuesses.forEach(guess => {
    const revealedCounts = new Map<string, number>();

    guess.letters.forEach((member, index) => {
      if (member.status === 'green') {
        requiredPositions.set(index, member.letter);
      }

      if (member.status === 'green' || member.status === 'yellow') {
        revealedCounts.set(
          member.letter,
          (revealedCounts.get(member.letter) ?? 0) + 1
        );
      }
    });

    revealedCounts.forEach((count, letter) => {
      minimumLetterCounts.set(
        letter,
        Math.max(count, minimumLetterCounts.get(letter) ?? 0)
      );
    });
  });

  for (const [position, letter] of requiredPositions) {
    if (word[position] !== letter) {
      return `${ordinal(position)} letter must be ${letter}`;
    }
  }

  for (const [letter, minimumCount] of minimumLetterCounts) {
    const actualCount = [...word].filter(member => member === letter).length;
    if (actualCount < minimumCount) {
      return minimumCount === 1
        ? `Guess must contain ${letter}`
        : `Guess must contain ${minimumCount} ${letter}'s`;
    }
  }

  return null;
};

const shareSquare = (status?: LetterStatus): string => {
  if (status === 'green') return '🟩';
  if (status === 'yellow') return '🟨';
  return '⬛';
};

export const buildShareText = (
  puzzleDefinition: PuzzleDefinition,
  puzzlePlay: PuzzlePlay,
  hardMode: boolean
): string => {
  const score =
    puzzlePlay.gameStatus === 'won' ? puzzlePlay.currentGuessIndex : 'X';
  const heading = `Wordle ${puzzleDefinition.number.toLocaleString('en-US')} ${score}/6${hardMode ? '*' : ''}`;
  const grid = puzzlePlay.guesses
    .slice(0, puzzlePlay.currentGuessIndex)
    .map(guess => guess.letters.map(member => shareSquare(member.status)).join(''))
    .join('\n');

  return `${heading}\n\n${grid}`;
};

export const dictionarySearch = async (word: string): Promise<boolean> => {
  if (!word) return false;

  const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
  try {
    const response = await fetch(dictionaryUrl);
    return response.ok;
  } catch (error) {
    console.error(`Error looking up word "${word}":`, error);
    return false;
  }
};
