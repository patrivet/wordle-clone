import { useEffect } from 'react';
import PuzzleCanvas from './components/PuzzleCanvas/PuzzleCanvas';
import { fetchDailyPuzzle, formatPuzzleDate } from './services/dailyPuzzle';
import {
  createInitialPuzzlePlay,
  useAppStoreActions,
  useAppStoreState,
} from './state/state';
import { loadPuzzlePlay, savePuzzlePlay } from './storage/gameStorage';
import { loadSettings, saveSettings } from './storage/settingsStorage';
import './App.css';

function App() {
  const {
    puzzleDefinition,
    puzzleLoadError,
    puzzleLoadStatus,
    puzzlePlay,
    settings,
  } = useAppStoreState(state => state);
  const { initialisePuzzle, setPuzzleError, setPuzzleLoading } =
    useAppStoreActions(actions => actions);

  useEffect(() => {
    const abortController = new AbortController();
    setPuzzleLoading();

    fetchDailyPuzzle(formatPuzzleDate(), abortController.signal)
      .then(definition => {
        const savedPuzzlePlay = loadPuzzlePlay(definition);
        initialisePuzzle({
          definition,
          puzzlePlay: savedPuzzlePlay ?? createInitialPuzzlePlay(),
          settings: loadSettings(),
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;

        const message =
          error instanceof Error ? error.message : 'The daily puzzle could not load';
        setPuzzleError(message);
      });

    return () => abortController.abort();
  }, [initialisePuzzle, setPuzzleError, setPuzzleLoading]);

  useEffect(() => {
    if (puzzleLoadStatus === 'ready' && puzzleDefinition) {
      savePuzzlePlay(puzzleDefinition, puzzlePlay);
      saveSettings(settings);
    }
  }, [puzzleDefinition, puzzleLoadStatus, puzzlePlay, settings]);

  return (
    <div className="app-wrapper">
      {puzzleLoadStatus === 'loading' && (
        <div className="app-message" role="status">
          Loading today&apos;s Wordle…
        </div>
      )}
      {puzzleLoadStatus === 'error' && (
        <div className="app-message app-message--error" role="alert">
          <strong>Unable to load today&apos;s Wordle.</strong>
          <span>{puzzleLoadError}</span>
          <button type="button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}
      {puzzleLoadStatus === 'ready' && puzzleDefinition && <PuzzleCanvas />}
    </div>
  );
}

export default App;
