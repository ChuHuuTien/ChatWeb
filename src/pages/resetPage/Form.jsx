/* eslint-disable no-unused-vars */
import { useState, MouseEvent } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Formik } from "formik";
import { ToastContainer,toast } from "react-toastify";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setFriends, setProfileFriends } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../Components/FlexBetween";
import { host } from '../../utils/APIRoutes';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from "next/dist/server/api-utils";



const resetSchema = yup.object().shape({
  oldPassword: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
  newPassword: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
});

const initialValuesReset = {
  oldPassword: "",
  newPassword: "",
};


const Form = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.token);
  const userid = useSelector((state)=> state.user.userid);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    try{
      const response = await axios.post(`${host}/auth/reset`, 
      {
        userid: userid,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      }, 
      {
        headers: { Authorization: `${token}` },
      });
      const user = await response.data.user;
      onSubmitProps.resetForm();
      if (user) {
        toast.success("Đổi mật khẩu thành công", toastOptions);
      }
    }catch(error){
      toast.error(error.response.data.error, toastOptions);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesReset}
      validationSchema={resetSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            
            <TextField
              label="Mật khẩu cũ"
              type={showPassword ? 'text' : 'password'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.oldPassword ||''}
              name="oldPassword"
              error={Boolean(touched.oldPassword) && Boolean(errors.oldPassword)}
              helperText={touched.oldPassword && errors.oldPassword}
              sx={{ gridColumn: "span 4" }}
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <IconButton 
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Mật khẩu mới"
              type={showPassword ? 'text' : 'password'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.newPassword ||''}
              name="newPassword"
              error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
              sx={{ gridColumn: "span 4" }}
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <IconButton 
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Đổi mật khẩu
            </Button>
            <Typography
              onClick={() => {
                navigate("/");
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              Trở về trang chủ
            </Typography>
          </Box>
        </form>
      )}
      
    </Formik>
    <ToastContainer />
    </> 
  );
};

export default Form;
