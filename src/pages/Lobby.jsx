import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function Lobby() {
    const { lobbyId } = useParams();
    const socket = useSocket();
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);

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

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Lobby ID : <span className='text-secondary'>{lobbyId}</span></h1>
            <h2 className="text-2xl font-semibold mb-4">Players joined :</h2>
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
