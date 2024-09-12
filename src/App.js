// In your routes configuration file
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import ResultPage from './pages/ResultPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/lobby/:lobbyId" element={<Lobby />} />
                <Route path="/game/:lobbyId" element={<Game />} />
                <Route path="/result" element={<ResultPage/>} />
                {/* Other routes */}
            </Routes>
        </Router>
    );
}

export default App;
