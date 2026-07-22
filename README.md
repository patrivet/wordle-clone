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
