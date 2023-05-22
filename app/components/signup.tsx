// import React, { useState } from 'react';
// import axios from 'axios';
// import VerificationCodeInput from './authcode';

// function SignUp() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (event:any) => {
//     event.preventDefault();

//     try {
//       const response = await axios.post('https://chatgpt.funny-code.top/wp-json/wp/v2/users', {
//         username: username,
//         email: email,
//         password: password
//       }, {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log(response);

//       const tokenResponse = await axios.post(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`, {
//         username: username,
//         password: password
//       });

//       console.log(tokenResponse);
//       localStorage.setItem('jwt_token', tokenResponse.data.token);

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="username">Username:</label>
//         <input
//           type="text"
//           id="username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="email">Email:</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="password">Password:</label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>
//       <VerificationCodeInput />
//       <button type="submit">Create Account</button>
//     </form>
//   );
// }

// export default SignUp;

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from '@mui/material/Link';
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DefaultHeader from "./header";
import { useEffect, useState } from "react";
import axios from "axios";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" to={""}>
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
  //获取验证码倒计时
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const handleCountdownDone = () => {
    setIsCounting(false);
    setCountdown(0);
  };

  const handleSendVerificationCodeButtonClick = () => {
    setCountdown(60);
    setIsCounting(true);
  };

  useEffect(() => {
    if (countdown === 0) {
      handleCountdownDone();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);
  //获取验证码
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSending, setIsSending] = useState(false);

  // 通过接口发送短信验证码
  const sendSmsVerificationCode = async () => {
    setIsSending(true);

    try {
      const response = await axios.post(
        "https://chatgpt.funny-code.top/wp-json/myplugin/v1/sms-send",
        { phone: phone },
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }

    setIsSending(false);
  };
  //注册表单&请求注册接口
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    //注册用户
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/users`,
        {
          username: username,
          email: email,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response);
      //获取token保存本地
      const tokenResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`,
        {
          username: username,
          password: password,
        },
      );

      console.log(tokenResponse);
      localStorage.setItem("jwt_token", tokenResponse.data.token);
    } catch (error) {
      console.log(error);
    }
  };
  //返回组件
  return (
    <ThemeProvider theme={defaultTheme}>
      <DefaultHeader />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            用户注册
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="手机号"
                  name="email"
                  autoComplete="phone number"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setPhone(e.target.value);
                    setEmail(e.target.value + "@funny-code.top");
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="输入手机验证码"
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {!isCounting && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleSendVerificationCodeButtonClick();
                          sendSmsVerificationCode();
                        }}
                      >
                        获取验证码
                      </Button>
                    )}
                    {isCounting && (
                      <Button disabled variant="contained">
                        {countdown}秒
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="密码"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/loginandregisiter">已有账户？去登录</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
