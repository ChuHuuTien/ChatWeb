/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PersonAddOutlined, Chat, Settings, Delete, DriveFileRenameOutline } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Popper, ClickAwayListener} from "@mui/material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { host } from "../utils/APIRoutes";
import axios from "axios";
import { useChat } from '../context/ChatProvider';
import useChatActions from '../hooks/useChatActions';

const UserSearch = ({ userId, name, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { userid } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const { currentRoom, setCurrentRoom, rooms, setRooms } = useChat();
  const { joinRoom, leaveRoom } = useChatActions();

  const patchRoom = async () => {
    const response = await axios.post(`${host}/room/initate`,
      {
        userIds:[
          userId
        ],
      type: "private"
      },
      {
        headers: { Authorization: `${token}` },
      }
    )
    const chatRoom = await response.data.chatRoom;
    if(chatRoom.isNew == false){
      handleRoomClick(chatRoom.chatRoomId);
    }else{
      navigate("/message");
      navigate(0);

      // const response = await axios.get(`${host}/room`,{
      //   headers: {
      //     Authorization: token
      //   },
      // });
      // setRooms(response.data.conversation);
      // handleRoomClick(chatRoom.chatRoomId);
    }
  };

  const handleRoomClick = (roomID) => {
    if(currentRoom?.id === roomID) {
        return;
    }
    if(currentRoom?._id) leaveRoom(currentRoom._id)

    const selectedRoom = rooms.find(room => room._id === roomID);
    setCurrentRoom(selectedRoom);

    joinRoom(roomID);

  }
  return (
    <FlexBetween padding="5px 0px">
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="35px" />
        <Box
          onClick={() => {
            navigate(`/profile/${userId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h6"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </Box>
      </FlexBetween>
        <IconButton
          onClick={() => patchRoom()}
          sx={{ 
            backgroundColor: primaryLight, 
            p: "0.5rem",
            size: 10
          }}
        >
          <Chat sx={{ color: primaryDark }} />
        </IconButton>
    </FlexBetween>
  );
};

export default UserSearch;
