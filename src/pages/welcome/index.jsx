import { Box, Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      textAlign: "center",

    }}
    >
      <h1 >Chat Web</h1>
      <p >
        Một ứng dụng nhắn tin đơn giản
      </p>
      <Button variant="contained" onClick={()=>navigate("/message")}>Nhắn tin</Button>
    </Box>
  );
};

export default Welcome;