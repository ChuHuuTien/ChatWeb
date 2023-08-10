/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react';
import io from 'socket.io-client';
import {host} from '../utils/APIRoutes';

const socket = io.connect(host);

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
}

export const ChatProvider = ({ children }) => {
    const [userName, setUserName] = useState('');
    const [currentRoom, setCurrentRoom] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [rooms, setRooms] = useState(null);

    const value = {
        socket,
        userName,
        setUserName,
        setCurrentRoom,
        currentRoom,
        newMessage, 
        setNewMessage,
        rooms,
        setRooms
    };
    
    return (
        <ChatContext.Provider value={ value }>
            { children }
        </ChatContext.Provider>
    );
};