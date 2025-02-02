import { Guess, PuzzleDefinition } from './types';

/* return:
  guess object with status on each letter.
*/
const analyseGuess = ( guess: Guess, puzzleDefinition: PuzzleDefinition ) => {
  const answerCopy = puzzleDefinition.answer; //ABCAT
  let answerCopy2 = puzzleDefinition.answer; //ABCAT

  for (let i = 0; i < 5; i++) {
    const nextLetter = guess.letters[i];

    if (nextLetter?.letter === answerCopy[i]) {
      nextLetter.status = 'green';
      // remove this letter from answerCopy2 and store back into that variable
      answerCopy2 =
        answerCopy2.substring(0, i) + '_' + answerCopy2.substring(i + 1);
      continue;
    }
    if (answerCopy.indexOf(nextLetter.letter) === -1) {
      nextLetter.status = 'grey';
      continue;
    }
  }
  // remove already set letters from the ?
  answerCopy2 = answerCopy2.replaceAll('_', '');

  // Return if all letters green or grey.
  if (guess.letters.filter(gl => gl.status === 'green').length === 5) {
    guess.isAnswer = true
    return(guess)
  } else if (guess.letters.filter(gl => gl.status === 'grey').length === 5) {
    return(guess)
  }

  // ? ------------------------ 2ND LOOP PASS --------------------------------------------
  const guessLettersLeft = guess.letters.filter(
    gl => gl.status === undefined
  );

  for (let i = 0; i < guessLettersLeft.length; i++) {
    const nextLetter = guessLettersLeft[i];

    if (answerCopy2.indexOf(nextLetter.letter) !== -1) {
      nextLetter.status = 'yellow';

      // remove the first occurance of this letter from answerCopy2 and store back into that variable
      answerCopy2 = answerCopy2.replace(nextLetter.letter, '_')
      continue;
    } else {
      nextLetter.status = 'grey';
      continue;
    }
  }
  return(guess);
};

const dictionarySearch = async (word: string): Promise<any | null> => {
  if (!word || !word.length) return null
  const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  try {
    const response = await fetch(dictionaryUrl);
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`error looking up word =${word}; error =${error}`)
    return null
  }
}

export { analyseGuess, dictionarySearch }