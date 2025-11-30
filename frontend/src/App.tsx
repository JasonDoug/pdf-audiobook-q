import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Upload } from './pages/Upload';
import { Beats } from './pages/Beats';
import { Player } from './pages/Player';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/beats/:jobId" element={<Beats />} />
        <Route path="/player/:jobId" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;
