/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Box, Button, TextField, useMediaQuery, useTheme, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "./FlexBetween";
import {host} from '../utils/APIRoutes';
import axios from "axios";


const accountSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  phonenumber: yup.number().min(10, "Số điện thoại không đúng định dạng").required("required"),
  avatarURL: yup.string().required("required"),
  gender: yup.string().required("required"),
});

const ManageAccount = ({ user }) => {
  const initialAccount = {
    firstName: user.firstName,
    lastName: user.lastName,
    phonenumber: user.phonenumber,
    avatarURL: user.avatarURL,
    gender: user.gender
  };
  
  const { palette } = useTheme();
  const userid = useSelector((state) => state.user.userid);
  const navigate = useNavigate();

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [image, setImage] = useState(null);

  const handleFormSubmit = async (values) => {
    if(image){
      values.image = image.base64;
    }
    values.userid = userid;
    const loggedInResponse = await axios.post(`${host}/user/update`, values);
    if(loggedInResponse){
      navigate(`/profile`);
      navigate(0);
    }
  };

  const onFileToBase64 = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      image.base64 = reader.result
    };
  };

  useEffect(()=>{
    if(image){
      onFileToBase64(image);
    }
  },[image])
  return (
    <Formik
      initialValues={initialAccount}
      validationSchema={accountSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
      <>
        <Box
          sx={{
            width: 1,
            height: 50,
            fontSize: 20,
          }}   
        >
          Chỉnh sửa hồ sơ
          {/* <IconButton
            onClick={handleClose}
            sx={{ 
              padding: 0,
              float: "right" 
            }}
          >
            <Close />
          </IconButton> */}
        </Box>
        <form onSubmit={handleSubmit}>

          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(6, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
            }}
          >
            <Box
              gridColumn="span 2"
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              p="1rem"
              sx={{
                height: 1,
                width: 1,
              }}
              onChange={handleChange}
              value={values.image}
              name="image"
            >
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => setImage(
                  (acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                  })))[0]
                )}
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    sx={{ 
                      "&:hover": { cursor: "pointer" },
                    }}
                  >
                    <input {...getInputProps()} />
                    <FlexBetween>
                      <Box
                        component="img"
                        sx={{
                          height: 1,
                          width: 1,
                        }}
                        
                        src={image?.preview ? image.preview : user.avatarURL}
                      />
                      </FlexBetween>
                  </Box>
                )}
              </Dropzone>
            </Box>    

            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                gridColumn: "span 4",
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >  
              <TextField
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
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
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Phone number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phonenumber ||''}
                name="phonenumber"
                error={Boolean(touched.phonenumber) && Boolean(errors.phonenumber)}
                helperText={touched.phonenumber && errors.phonenumber}
                sx={{ gridColumn: "span 4" }}
                disabled
              />
              {/* <TextField
                label="Gender"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.gender ||''}
                name="gender"
                error={Boolean(touched.gender) && Boolean(errors.gender)}
                helperText={touched.gender && errors.gender}
                sx={{ gridColumn: "span 4" }}
              /> */}
              <FormControl sx={{ gridColumn: "span 4" }}>
                <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="male"
                  name="gender"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.gender ||''}
                  
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Box>        
            

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
              Cập nhật
            </Button>
          </Box>
        </form>

      </>
      )}
    </Formik>
  );
};

export default ManageAccount;
