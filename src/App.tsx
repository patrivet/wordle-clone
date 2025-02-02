import PuzzleCanvas from './components/PuzzleCanvas/PuzzleCanvas';
import { useStoreState } from 'easy-peasy';
import './App.css';

function App() {
  const puzzlePlayState = useStoreState(state => state.puzzlePlay);
  return (
    <div className="app-wrapper">
      <PuzzleCanvas puzzlePlay={puzzlePlayState} />
    </div>
  );
}

export default App;
