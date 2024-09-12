// ResultPage.js
import React from 'react';
import { useGame } from '../context/gameContext';
import { useNavigate } from 'react-router-dom';
import LottieLoader from '../components/LottieLoader';

const ResultPage = () => {
    const { gameData } = useGame();
    const navigate = useNavigate();

    if (!gameData) {
        return <div className="mx-auto h-screen w-screen bg-gray-900 flex justify-center items-center text-white" >Loading...</div>;
    }

    const { players, message } = gameData;

    return (
        <div className="mx-auto h-screen w-screen bg-gray-900 flex justify-center items-center flex-col">
           <div className="bg-gray-900  p-4  rounded-lg flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold mb-4 text-secondary">{message} 🏁</h1>
            <LottieLoader/>
                <h2 className="text-2xl font-bold mb-2 text-primary">Final Scores</h2>
                <ul>
                    {players.length > 0 ? (
                        players.map((player) => (
                            <li key={player.id} className="mb-2 font-bold text-lg text-white">
                                {player.name}: {player.score} points
                            </li>
                        ))
                    ) : (
                        <li>No players found</li>
                    )}
                </ul>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-3 bg-primary hover:bg-primary_dark text-white font-bold rounded-lg transition duration-200 shadow-lg"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default ResultPage;
