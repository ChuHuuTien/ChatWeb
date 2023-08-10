/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Formik } from "formik";
import { ToastContainer,toast } from "react-toastify";
import * as yup from "yup";
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setFriends, setProfileFriends } from "../../state"
import {host, loginRoute, registerRoute} from '../../utils/APIRoutes';
import 'react-toastify/dist/ReactToastify.css';

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Trống"),
  lastName: yup.string().required("Trống"),
  phonenumber: yup.string().min(10, "Số điện thoại không phù hợp").required("Trống"),
  password: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
  // picture: yup.string().required("Trống"),
});

const loginSchema = yup.object().shape({
  phonenumber: yup.string().min(10, "Số điện thoại không phù hợp").required("Trống"),
  password: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
});

const otpSchema = yup.object().shape({
  otp: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  phonenumber: "",
  password: "",
  // picture: "",
};

const initialValuesLogin = {
  phonenumber: "",
  password: "",
};
const initialOtp = {
  otp: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isSendOtp = pageType === "sendOtp"

  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const register = async (values, onSubmitProps) => {
    
    
    try{
      const sendPhoneResponse = await axios.post(`${host}/auth/phone`, 
        {
          phonenumber: values.phonenumber
        }
      );
      if(sendPhoneResponse){
        toast.success("Gửi thông tin thành công, vui lòng nhập OTP", toastOptions);
        setPageType("sendOtp");
      }
    }catch(error){
      toast.error(error.response.data.error, toastOptions);
    }

  };

  const login = async (values, onSubmitProps) => {
    try{
      const loggedInResponse = await axios.post(loginRoute, values);
      const loggedIn = await loggedInResponse.data;
      onSubmitProps.resetForm();
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.accessToken,
          })
        );
        // const response = await axios.get(`${host}/user/${loggedIn.user.userid}/friends`, {
        //   headers: { Authorization: loggedIn.accessToken },
        // })
        // const friends = await response.data.friends;
        // dispatch(setProfileFriends({friends: friends}));
        // dispatch(setFriends({friends: friends}));
        navigate("/");
      }
    }catch(error){
      toast.error(error.response.data.error, toastOptions);
    }
  };

  const sendOtp = async (values, onSubmitProps) => {
    try{
      const sendOtpResponse = await axios.post(`${host}/auth/otp`, 
        {
          phonenumber: values.phonenumber,
          otp: values.otp
        }
      );
      if(sendOtpResponse){
        const registerResponse = await axios.post(`${host}/auth/register`, 
          {
            firstName: values.firstName,
            lastName: values.lastName,
            phonenumber: values.phonenumber,
            password: values.password
          }
        );
        if(registerResponse){
          onSubmitProps.resetForm();
          toast.success("Đăng kí thành công", toastOptions);
          setPageType("login")
        }
      }else{
        toast.error("Xác thực không thành công", toastOptions);
      }
    }catch(error){
      console.log(error)
      toast.error(error.response.data.error, toastOptions);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isSendOtp) await sendOtp(values, onSubmitProps);
  };

  return (
    <>
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={ isSendOtp ? initialOtp: (isLogin ? initialValuesLogin : initialValuesRegister)}
      validationSchema={ isSendOtp ? otpSchema: (isLogin ? loginSchema : registerSchema)}
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
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName ||''}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName ||''}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
               
              </>
            )}

            {!isSendOtp &&
              (<>
                <TextField
                  label="Phone number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phonenumber ||''}
                  name="phonenumber"
                  error={Boolean(touched.phonenumber) && Boolean(errors.phonenumber)}
                  helperText={touched.phonenumber && errors.phonenumber}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password ||''}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
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
              </>)
            }


            {isSendOtp &&
            (
              <>
                <TextField
                  label="OTP"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.otp ||''}
                  name="otp"
                  error={Boolean(touched.otp) && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )

            }
          </Box>

          {/* BUTTONS */}
          <Box>
            <LoadingButton
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
              {isSendOtp? "verify" :(isLogin ? "LOGIN" : "REGISTER")}
            </LoadingButton>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
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
              {isSendOtp? "" :(isLogin
                ? "Không có tài khoản? Đăng kí ở đây."
                : "Đã có tài khoản? Đăng nhập ở đây.")}
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
