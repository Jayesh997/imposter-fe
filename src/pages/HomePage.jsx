import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import LottieLoader from '../components/LottieLoader';

const HomePage = () => {
    const [username, setUsername] = useState('');
    const [lobbyId, setLobbyId] = useState('');
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('Connected to server');
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from server');
            });

            socket.on('connect_error', (error) => {
                console.error('Connection Error:', error);
            });

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('connect_error');
            };
        }
    }, [socket]);

    const handleCreateLobby = () => {
        const newLobbyId = Math.random().toString(36).substring(2, 7); // Generate a random lobby ID
        socket.emit('createGame', newLobbyId, username);
        navigate(`/lobby/${newLobbyId}`); // Redirect to the lobby page
    };
    const handleJoinLobby = () => {
        if (lobbyId.trim() !== '') {
            socket.emit('joinGame', lobbyId, username);
        navigate(`/lobby/${lobbyId}`); // Redirect to the lobby page
        } else {
            alert('Please enter a valid Lobby ID.');
        }
    };

    const handleLobbyUpdate = () => {
        const gameId = 'exampleGameId'; // Replace with actual game ID

        if (socket) {
            socket.emit('lobbyUpdate', gameId);
        } else {
            console.error('Socket not initialized');
        }
    };

    return (

         <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
         <h1 className="text-4xl font-bold mb-8">Guess The <span className='text-secondary'>Imposter</span> 💀</h1>
         <LottieLoader/>
         <div className="mb-6 w-80">
             <input
                 type="text"
                 placeholder="Username"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
             <input
                 type="text"
                 placeholder="Lobby ID (for Join Lobby)"
                 value={lobbyId}
                 onChange={(e) => setLobbyId(e.target.value)}
                 className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
         </div>
         <div>
             <button
                 onClick={handleCreateLobby}
                 className="px-6 py-3 mr-4 bg-primary hover:bg-primary_dark text-white font-bold rounded-lg transition duration-200 shadow-lg"
             >
                 Create Lobby
             </button>
             <button
                 onClick={handleJoinLobby}
                 className="px-6 py-3 bg-secondary hover:bg-secondary_dark text-white font-bold rounded-lg transition duration-200 shadow-lg"
             >
                 Join Lobby
             </button>
         </div>
     </div>
    );
};

export default HomePage;
