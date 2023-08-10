/* eslint-disable no-unused-vars */
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import Welcome from "../welcome"

const HomePage = () => {

  return (
    <Box >
      <Navbar />
      <Welcome/>
      
    </Box>
  );
};

export default HomePage;
