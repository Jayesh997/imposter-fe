import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/gameContext';
import LottieLoader from '../components/LottieLoader';

function Game() {
    const { lobbyId } = useParams();
    const  socket  = useSocket();
    const [gameState, setGameState] = useState(null);
    const [userWord, setUserWord] = useState('');
    const [selectedVote, setSelectedVote] = useState(null);
    const [isVoting, setIsVoting] = useState(false);
    const [revealedImposter, setRevealedImposter] = useState(null);
    const [roundResult, setRoundResult] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isBetweenRounds, setIsBetweenRounds] = useState(false);
    const { setGameData } = useGame();
    const navigate = useNavigate();
    const ROUND_WAIT_TIME = 5; // 10 seconds for the next round

    useEffect(() => {
        if (!socket) return;

        socket.emit('joinGame', lobbyId);

        socket.on('gameStateUpdate', (state) => {
            setGameState(state);

            // Reset states if a new round starts
            if (state.currentRound !== gameState?.currentRound) {
                setRoundResult(null);
                setRevealedImposter(null);
                setSelectedVote(null);
                setUserWord('');
                setIsBetweenRounds(false);
                setTimer(0);
            }

            setIsVoting(state.started && state.players.every(p => !p.vote));
        });

        // Example code to handle game end and redirect to ResultPage
        const handleGameEnd = (players) => {
            setGameData({
                players: players,
                message: 'Game Over'
            });
            navigate('/result');
        };

        // Assume socket is initialized elsewhere
        socket.on('gameEnded', handleGameEnd);

        socket.on('revealImposter', (imposterId) => {
            setRevealedImposter(imposterId);
        });

        socket.on('roundResult', (result) => {
            setRoundResult(result);
            // Start countdown for the next round
            setIsBetweenRounds(true);
            setTimer(ROUND_WAIT_TIME);
        });

        // socket.on('gameEnded', (players) => {
        //     alert('Game over! Here are the final scores:\n' + players.map(p => `${p.name}: ${p.score} points`).join('\n'));
        // });

        return () => {
            socket.off('gameStateUpdate');
            socket.off('revealImposter');
            socket.off('roundResult');
            socket.off('gameEnded');
        };
    }, [socket, lobbyId, gameState, setGameData]);

    // Timer logic for starting the next round
    useEffect(() => {
        if (timer > 0 && isBetweenRounds) {
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, isBetweenRounds]);

    const handleSubmitWord = () => {
        if (userWord.trim()) {
            socket.emit('submitWord', lobbyId, userWord);
            setUserWord('');
        }
    };

    const handleVote = (playerId) => {
        setSelectedVote(playerId);
    };

    const handleSubmitVote = () => {
        if (selectedVote) {
            socket.emit('vote', lobbyId, selectedVote);
            setSelectedVote(null); // Clear selection after voting
            setIsVoting(false);
        }
    };

    const fetchGameData = () => {
        // Emit the event to request the game data from the server
        socket.emit('fetchGameData', lobbyId); // Assuming gameData contains gameId
    
        // Listen for the game data from the server
        socket.on('gameDataFetched', (updatedGameData) => {
          setGameState(updatedGameData);
        });
    
        socket.on('error', (errorMsg) => {
          console.error(errorMsg);
        });
      };

    const renderProgressBar = () => {
        const progressPercentage = ((ROUND_WAIT_TIME - timer) / ROUND_WAIT_TIME) * 100;
        return (
            <div className="w-full bg-gray-700 rounded h-4 mt-4">
                <div
                    style={{ width: `${progressPercentage}%` }}
                    className="bg-secondary h-4 rounded"
                ></div>
            </div>
        );
    };

    if (!gameState) {
        return <div className="pt-20 text-white text-center h-screen w-screen bg-gray-900">
            <h1 className='text-2xl'>Ready 😎 ? </h1>
            <LottieLoader/>
        <button className="px-6 py-3 bg-primary hover:bg-primary_dark text-white font-bold rounded-lg shadown-lg transition duration-200" onClick={fetchGameData}>Start Game</button>
        </div>;
    }

    if (!gameState.started) {
        return <div className="text-white text-center mt-20 bg-gray-900">Waiting for the game to start...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Round {gameState.currentRound} / 5</h1>

            <div className="flex flex-col items-center mb-8">
                {roundResult && <h2 className="text-2xl font-semibold mb-4">{roundResult}</h2>}

                {revealedImposter && (
                    <h2 className="text-2xl font-semibold mb-4">
                        Imposter was <span className='text-primary'>{gameState.players.find(p => p.id === revealedImposter).name}</span>
                    </h2>
                )}

                {!revealedImposter && (
                    <>
                    <h2 className="text-2xl font-semibold mb-4">
                      The Category is <span className='text-secondary'>
                        {gameState.category}
                        </span> 
                    </h2>
                    <h2 className="text-2xl font-semibold mb-4">
                        {gameState.players.find(p => p.id === socket.id).isImposter ? <p>You are the <span className='text-primary'>Imposter</span> 😈</p> : <p>The Secret is <span className='text-primary'>{gameState.secretWord}</span></p>}
                    </h2>
                    </>
                )}

<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
    {gameState.players.map((player) => (
        <div key={player.id} className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            <div className="text-lg font-bold mb-2 text-secondary">{player.name}</div>
            <div className="text-lg font-bold mb-2">Score: {player.score}</div>

            <div className="mb-2">
                <img src={`https://robohash.org/${player.id}`} alt="icon" className="w-16 h-16 mx-auto mb-2" />
            </div>
            <div className="mb-2">
                Clue: {player.word ? <span className='text-secondary text-lg'>{player.word}</span> :'waiting...'}
            </div>
            <div className="mb-2">
                Voted: {gameState.players.find(p => p.id === player.vote)?.name ?<span className='text-primary text-lg'>{gameState.players.find(p => p.id === player.vote)?.name}</span> : 'waiting...'}
            </div>

            {/* Show vote options only if the current player hasn't voted */}
            {gameState.started &&  (
                <div>
                    <label htmlFor={`vote-${player.id}`} className="mr-2">Vote</label>
                    <input
                        type="checkbox"
                        id={`vote-${player.id}`}
                        checked={selectedVote === player.id}
                        onChange={() => handleVote(player.id)}
                    />
                </div>
            )}
        </div>
    ))}
</div>

            </div>

            {/* Submit word input */}
            {gameState.started && !gameState.players.find(p => p.id === socket.id).word && (
                <div className="mb-8">
                    <input
                        type="text"
                        value={userWord}
                        onChange={(e) => setUserWord(e.target.value)}
                        placeholder="Submit your word"
                        className="p-2 rounded bg-gray-800"
                    />
                    <button onClick={handleSubmitWord} className="ml-2 bg-secondary hover:bg-secondary_dark px-6 py-3 shadow-lg font-bold text-white p-2 rounded">Submit Word</button>
                </div>
            )}

            {/* Submit vote button */}
            {gameState.started && !gameState.players.find(p => p.id === socket.id).vote && gameState.players.find(p => p.id === socket.id).word&& !isBetweenRounds && (
                <div>
                    <button 
                        onClick={handleSubmitVote} 
                        className={`p-2 rounded ${gameState.players.find(p => p.id === socket.id).word ? 'bg-primary hover:bg-primary_dark px-6 py-3 font-bold shadow-lg text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                        disabled={!gameState.players.find(p => p.id === socket.id).word} // Disable button if word is not submitted
                    >
                        Submit Vote
                    </button>
                </div>
            )}

            {/* Show "Waiting for votes..." only if the current player has submitted both their word and vote */}
            {gameState.players.find(p => p.id === socket.id).vote && (
                <div className="text-lg mt-4">Waiting for votes...</div>
            )}

            {/* Show progress bar when waiting for the next round */}
            {isBetweenRounds && timer > 0 && (
  <div className="text-lg mt-4">
    {gameState.currentRound === 5 ? (
      <span>Calculating results in {timer} seconds</span>
    ) : (
      <span>Next round starts in {timer} seconds</span>
    )}
    {renderProgressBar()}
  </div>
)}

        </div>
    );
}

export default Game;
