# Repository instructions

## Project overview

This repository is a React, TypeScript, and Vite implementation of Wordle.

## Running and validating the app

- Start the development server with `npm run dev`.
- Access the local UI at <http://localhost:5173/>.
- Use `npm run build` to run the TypeScript build and create the production bundle.
- Use `npm run lint` to run the repository's lint checks.
- After making user-visible or gameplay changes, inspect and exercise the local UI in the browser rather than relying only on static code review.

## Puzzle answer used during development

- The current answer is loaded by `src/services/dailyPuzzle.ts` from the date-based NYT Wordle endpoint through the `/api/wordle` Vite proxy.
- Set `VITE_WORDLE_ANSWER` to a five-letter word when a predictable answer is useful for development or testing, for example `VITE_WORDLE_ANSWER=SLEEP npm run dev`.
- Add `?showAnswer=1` to the local URL to render the active answer during development.
- Do not hard-code a daily production answer in the store.

## Original Wordle as the behavior reference

- The live/original Wordle is available at <https://www.nytimes.com/games/wordle/index.html>.
- Use Chrome MCP when working on tasks in this repository. In particular, inspect the original game when a task involves UI layout, responsive behavior, styling, CSS transitions or animations, keyboard behavior, gameplay rules, or other interaction details.
- The NYT page may show cookie notices, subscription prompts, instructions, or other popups. Close or dismiss them as needed before inspecting the game.
- Compare the relevant behavior in the original game with <http://localhost:5173/> and verify the local implementation interactively after making changes.
- Treat the original game as a behavioral and visual reference. Implement changes in this repository's own React, TypeScript, and styling structure.
