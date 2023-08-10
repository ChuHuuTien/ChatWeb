/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RoomList from './RoomList';
import ChatForm from './ChatForm';
import Conversation from './Conversation';
import SearchBar from './SearchBar';
import FlexBetween from './FlexBetween';
import { useChat } from '../context/ChatProvider';
import { host } from "../utils/APIRoutes";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatAppContainer = styled.div`
    --vertical-padding: 3vh;

    display: flex;
    gap: 2vw;
    height: 80vh;
    width: 80vw;
    justify-content: space-between;
    background: #e5e7e8;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
                rgba(0, 0, 0, 0.12) 0px -12px 30px,
                rgba(0, 0, 0, 0.12) 0px 4px 6px,
                rgba(0, 0, 0, 0.17) 0px 12px 13px,
                rgba(0, 0, 0, 0.09) 0px -3px 5px;

    @media (max-width: 820px) {
        position: relative;
        width: 100%;
        height: 100vh;
        flex-direction: column-reverse;
        font-size: 0.85rem;
        gap: 0;
    }
`;

const CenterContainer = styled.div`
    display: flex;
    flex: 1;
    gap: 1.5vw;
    flex-direction: column;
    height: 100%;
    margin: auto 0;
    padding: 3vw 1vw;

    @media (max-width: 820px) {
        height: 80%;
    }
    
`;

const Chat = styled.div`
    padding: var(--vertical-padding) var(--vertical-padding) 1.5vh var(--vertical-padding);
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 80%;
    background: #fff;
    border-radius: 30px;

    @media (max-width: 820px) {
        margin: 0 2.5vw;
    }
`;

const Header = styled.header`
    display: flex;
    align-items: center;
    gap: 1.1em;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding-bottom: 1em;
    height: 3.2em;
    
    & img {
        height: 100%;
        border-radius: 0.7em;
    }

    & h2 {
        font-size: 0.85em;
        font-weight: 600;
    }
`;

const WelcomeMessage = styled.p`
    margin: auto 0;
    font-size: 0.9em;
    text-align: center;
    color: rgba(0, 0, 0, 0.5);
`;

const ChatContainer = () => {
    const [query, setQuery] = useState('');
    const [isNavOpen, setIsNavOpen] = useState();
    const { currentRoom, rooms, setRooms } = useChat();
    // const [rooms, setRooms] = useState(null);
    const token = useSelector((state) => state.token);

    useEffect( () => {
        const loadData = async ()=>{
            const data = await axios.get(`${host}/room`,{
                headers: {
                  Authorization: token
                },
            });
            setRooms(data.data.conversation);
        };
        loadData();
    },[]);
    return (
        <ChatAppContainer>
            {/* <Navigation openRoomNav={ () => setIsNavOpen(true) } /> */}
            {rooms && <RoomList
                query={ query }
                isNavOpen={ isNavOpen }
                setIsNavOpen={ setIsNavOpen }
                rooms={rooms}
            />}
            <CenterContainer>
                {/* <SearchRooms query={ query } setQuery={ setQuery } /> */}
                <FlexBetween
                    backgroundColor="#f0f0f0"
                    borderRadius="9px"
                    gap="3rem"
                    padding="0.1rem 1.5rem" 
                    margin=""
                    sx={{
                        width: 325
                    }}
                >
                    
                    <SearchBar/>
                </FlexBetween>
                <Chat>
                    {
                        ! currentRoom ? 
                        
                        <WelcomeMessage>Come join the fun! <br/> Chat with friends or meet new ones in one of our lively chat rooms.<br/> See you there! 🙋🏽‍♂️</WelcomeMessage>
                        :
                        <>
                            <Header> 
                                {currentRoom.type=="private" ? (
                                    <>
                                        <img alt='room-img' src={ currentRoom.users[0].avatarURL } />
                                        <div>
                                            <h2>{ `${currentRoom.users[0].firstName} ${currentRoom.users[0].lastName}` }</h2>
                                            {/* <Description color='#000' size='0.75em'>{ currentRoom.description }</Description> */}
                                        </div>
                                    </>
                                ):(
                                    <>
                                        <img alt='room-img' src={ "https://res.cloudinary.com/dckxgux3k/image/upload/v1690714125/AvatarGroup_at4kad.png" } />
                                        <div>
                                            <h2>{ currentRoom.groupName }</h2>
                                            {/* <Description color='#000' size='0.75em'>{ currentRoom.description }</Description> */}
                                        </div>
                                    </>
                                )}
                                
                            </Header>
                            
                            <Conversation />
            
                            <ChatForm />
                        </>

                    }
                </Chat>
            </CenterContainer>

            
        </ChatAppContainer>
    );
};

export default ChatContainer;