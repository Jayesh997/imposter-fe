import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('wss://imposter-be.vercel.app',{
            transports: ['websocket', 'polling'], // Prefer WebSocket over polling
            withCredentials: true
        });

        console.log('env')
        setSocket(newSocket);

        return () => {
            newSocket.close(); // Clean up the socket connection on component unmount
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
