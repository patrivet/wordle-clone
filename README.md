# Wordle clone

A React, TypeScript, and Vite implementation of the daily Wordle game.

## Local development

```sh
npm install
npm run dev
```

Open <http://localhost:5173/>.

The development server proxies the date-based NYT Wordle endpoint so the app can load the current puzzle without cross-origin browser errors. A production deployment will need to provide the same `/api/wordle` proxy route.

### Testing with a known answer

Set `VITE_WORDLE_ANSWER` when starting Vite to replace the fetched answer while retaining the current puzzle date and number:

```sh
VITE_WORDLE_ANSWER=SLEEP npm run dev
```

Add `?showAnswer=1` to the local URL to display the active answer in development.

## Checks

```sh
npm test
npm run lint
npm run build
```

Submitted guesses and keyboard state are saved in local storage and restored only when they belong to the current daily puzzle.

Guesses can be entered with the physical keyboard as well as the on-screen
keyboard. Letter keys add A–Z, Backspace removes the latest letter, and Enter
submits the current row. Interactive controls can be reached with Tab and show
a visible focus outline.

Hard Mode is available from the settings cog. The preference is saved locally,
and it cannot be changed after the first guess has been submitted. Completed
games can be shared from the Statistics screen using the system share sheet or,
when that is unavailable, by copying the result grid to the clipboard. Finished
games can reopen that screen from the Statistics icon in the header.
