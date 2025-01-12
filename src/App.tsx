import PuzzleCanvas from './components/PuzzleCanvas';
import { AppProvider, useAppState } from './state/reducer';
import './App.css';
function App() {
  const { puzzlePlay } = useAppState();

  return (
    <AppProvider>
      <PuzzleCanvas puzzlePlay={puzzlePlay} />
    </AppProvider>
  );
}

export default App;
