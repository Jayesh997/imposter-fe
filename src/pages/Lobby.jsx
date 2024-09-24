import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { FaCopy } from 'react-icons/fa'; // Import the copy icon from FontAwesome (or your preferred library)

function Lobby() {
    const { lobbyId } = useParams();
    const socket = useSocket();
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        if (!socket) return;

        socket.emit('joinLobby', lobbyId);

        socket.on('lobbyUpdate', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });
        socket.on('gameStateUpdate', (gameState) => {
            setPlayers(gameState.players);
        });

        socket.on('startGame', () => {
            navigate(`/game/${lobbyId}`); // Use navigate instead of history.push
        });

        return () => {
            socket.off('lobbyUpdate');
            socket.off('startGame');
        };
    }, [socket, lobbyId, navigate]);

    const handleStartGame = () => {
        socket.emit('startGame', lobbyId);
    };

    const handleCopyLobbyId = () => {
        navigator.clipboard.writeText(lobbyId)
            .then(() => {
                setCopySuccess('Lobby ID copied 👍');
                setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6 flex">
                Lobby ID: 
                <span
                    className="text-secondary cursor-pointer flex items-center ml-2"
                    onClick={handleCopyLobbyId}
                >
                    {lobbyId}
                    <FaCopy className="ml-2 text-lg hover:text-white" /> {/* Copy icon */}
                </span>
            </h1>
            {copySuccess && <p className="text-green-400 mb-4">{copySuccess}</p>}
            <h2 className="text-2xl font-semibold mb-4">Players joined:</h2>
            <ul className="mb-8">
                {players.map((player, index) => (
                    <li key={index} className="text-2xl">
                        {player.name}
                    </li>
                ))}
            </ul>
            <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-primary hover:bg-primary_dark text-white font-bold rounded-lg transition duration-200 shadow-lg"
            >
                Join Game
            </button>
        </div>
    );
}

export default Lobby;
