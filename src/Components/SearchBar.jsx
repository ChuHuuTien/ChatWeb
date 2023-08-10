/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

// import * as React from 'react';
import useAutocomplete from '@mui/base/useAutocomplete';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Box, IconButton, InputBase, TextField, useMediaQuery, useTheme} from "@mui/material";
import { Search } from "@mui/icons-material";
import UserSearch from "./UserSearch";
import { host } from "../utils/APIRoutes";
import axios from "axios";


const SearchBar = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  // const friends = useSelector((state) => state.profilefriends);
  const token = useSelector((state) => state.token);
  const userid = useSelector((state) => state.user.userid);
  const [users, setUsers] = useState();


  const getAllUser = async () => {
    const response = await axios.get(`${host}/user/except/${userid}`)
    const users = await response.data.users;
    setUsers(users);
  };

  useEffect(()=>{
    getAllUser();

  },[])
  

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    options: users,
    getOptionLabel: (option) => `${option.firstName} ${option.lastName}`
  });

  return (
    <Box>
      <Box {...getRootProps()}>
        <TextField
          inputProps={{ 
            ...getInputProps()
          }}
          InputProps={{
            endAdornment: <IconButton><Search /></IconButton>,
            disableUnderline: true,
          }}
          // {...getInputProps()} 
          placeholder="Search..."
          sx={{
            width: isNonMobileScreens ? "300px" : "250px",
            
          }}
          variant="standard"
        />
      </Box>
      {groupedOptions.length > 0 ? (
        <Box 
          sx={{
            width: isNonMobileScreens ? "300px" : "250px",
            height: "600px",
            backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#000',
            overflow: "auto",
            maxHeight: "250px",
            position: "fixed",
            zIndex: "5",
          }}
        {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <UserSearch
              key={option._id}
              userId={option._id}
              name={`${option.firstName} ${option.lastName}`}
              userPicturePath={option.avatarURL}
              {...getOptionProps({ option, index })}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};


export default SearchBar;
