/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useChat } from "../context/ChatProvider";
import axios from 'axios';
import { host } from "../utils/APIRoutes";
import { useDispatch, useSelector } from "react-redux";

const useMessages = () => {
    const { socket, currentRoom, newMessage } = useChat();
    const [messages, setMessages] = useState([]);
    const token = useSelector((state) => state.token);
  
    useEffect(() => {
        socket.on('msg-recieve', (newMessage) => {
            setMessages((m) => [...m, newMessage]);
        });

        return () => {
            socket.off('msg-recieve');
        }
    }, [socket]);

    useEffect(() => {
      if(newMessage){
        setMessages((m) => [...m, newMessage]);
      }
    }, [newMessage])

    const changeCurrentRoom = async (roomID) => {
        try{
          const response = await axios.get(`${host}/room/${roomID}?page=0&limit=${100}`, {
            headers: {
              Authorization: token
            },
          });
          setMessages(response.data.conversation);
          
        }catch(error){
          console.log(error);
        }
    }
    
    useEffect(() => {
        changeCurrentRoom(currentRoom._id);
        // setMessages([]);
    }, [currentRoom])

    return messages;
}

export default useMessages;
