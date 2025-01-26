import PuzzleCanvas from './components/PuzzleCanvas';
import { useStoreState } from 'easy-peasy';
import './App.css';

function App() {
  const puzzlePlayState = useStoreState(state => state.puzzlePlay)
  return (
    <PuzzleCanvas puzzlePlay={puzzlePlayState} />
  );
}

export default App;
