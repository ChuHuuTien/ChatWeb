/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import styled from 'styled-components';
import { IoIosSend } from 'react-icons/io'
import { ButtonContainer } from '../styled/Button';
import useChatActions from '../hooks/useChatActions';
import { useChat } from '../context/ChatProvider';
import { host } from "../utils/APIRoutes";
import axios from "axios";
import { useSelector } from "react-redux";

const MessageForm = styled.form`
    padding: 0.5vw 0;
    display: flex;
    align-items: center;
    height: 10%;

    border-top: 1px solid rgba(0, 0, 0, 0.08);

    & input {
        flex: 1;
        height: 100%;
        width: 100%;
        border: none;
    }
`;

const ChatForm = () => {
    const inputRef = useRef(null);
    const { sendMessage } = useChatActions();
    const { currentRoom, setNewMessage } = useChat();
    const token = useSelector((state) => state.token);

    const onSubmit = async (e) => {
        e.preventDefault();
        if(inputRef.current.value == "") return;
        const newmsg = await axios.post(`${host}/room/${currentRoom._id}/message`, 
            {
                messageText: inputRef.current.value,
            },{
                headers: {
                Authorization: token
                },
            }
        );
        sendMessage(newmsg.data.message);
        setNewMessage(newmsg.data.message);
        inputRef.current.value = '';
        inputRef.current.focus();
    }

    return (
        <MessageForm onSubmit={ onSubmit }>
            <input type="text" placeholder='Type a message here' ref={ inputRef }/>
            
            <ButtonContainer flex="0" padding="0" active={ true } size="2.2em" borderRadius="50%">
                <button>
                    <IoIosSend fill='#fff'/>
                </button>
            </ButtonContainer>
        </MessageForm>
    );
};

export default ChatForm;