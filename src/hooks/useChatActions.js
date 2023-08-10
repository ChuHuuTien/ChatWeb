import { useChat } from "../context/ChatProvider";

const useChatActions = () => {
    const { socket } = useChat();
    

    const joinRoom = (roomID) => {
        socket.emit('subscribe', roomID);
    }

    const leaveRoom = (roomID) => {
        socket.emit('unsubscribe', roomID);
    }

    const sendMessage = (data) => {
        if(data.message=="") {
            return;
        }
        socket.emit('send-msg', data);
    }

    return {
        joinRoom,
        sendMessage,
        leaveRoom
    }
};

export default useChatActions;