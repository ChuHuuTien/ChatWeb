/* eslint-disable no-unused-vars */
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import ManageAccount from "../../Components/ManageAccount";
import {host} from '../../utils/APIRoutes';
import axios from "axios";
import { useState, useEffect } from "react";



const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const userLoginId = useSelector((state) => state.user.userid);

  const getUser = async () => {
    const response = await axios.get(`${host}/user/${userLoginId}`)
    const user = await response.data.user;
    setUser(user);
  };

  useEffect(() => {
    getUser();    
  }, []);

  return (
    <Box>
      <Navbar />
      
      <Box
        width="100%"
        padding="2rem 6%"
        display="block"
        // display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        {user && <ManageAccount user={user}/>}
        
      </Box>
    </Box>
  );
};

export default ProfilePage;
