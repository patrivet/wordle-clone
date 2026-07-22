import {
  GuessStatus,
  type Guess,
  type GuessLetter,
  type LetterStatus,
  type PuzzleDefinition,
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
