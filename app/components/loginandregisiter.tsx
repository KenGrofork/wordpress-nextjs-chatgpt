// import { useState } from "react";
// import axios, { AxiosError, AxiosResponse } from "axios";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [showError, setShowError] = useState(false);

//   const handleUsernameChange = (event: any) => {
//     setUsername(event.target.value);
//   };

//   const handlePasswordChange = (event: any) => {
//     setPassword(event.target.value);
//   };

//   const handleSubmit = async (event: any) => {
//     event.preventDefault();
//     try {
//       const postData = {
//         username,
//         password,
//       };
//       const response: AxiosResponse<any> = await axios.post(
//         `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`,
//         postData,
//       );
//       localStorage.setItem("jwt_token", response.data.token);
//     } catch (error: unknown) {
//       if ((error as AxiosError).response?.status === 400) {
//         setError("用户名或密码错误");
//         setShowError(true);
//       } else {
//         setError((error as AxiosError).message);
//         setShowError(true);
//       }
//     }
//   };

//   return (
//     <div className="login-model">
//       {showError && <p className="error-model">{error}</p>}
//       <form className="login-form" onSubmit={handleSubmit}>
//         <label className="username-lable">
//           用户名:
//           <input type="text" value={username} onChange={handleUsernameChange} />
//         </label>
//         <label>
//           密码:
//           <input
//             className="password-lable"
//             type="password"
//             value={password}
//             onChange={handlePasswordChange}
//           />
//         </label>
//         <button className="submit-button" type="submit">
//           提交
//         </button>
//       </form>
//     </div>
//   );
// }

// // export default Login;
// import * as React from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import "./loginandregisiter.scss"
// import Button from '@mui/material/Button';
// import SendIcon from '@mui/icons-material/Send';

// export default function Login() {
//   const [name, setName] = React.useState('');

//   return (

//     <><Box
//       component="form"
//       sx={{
//         '& > :not(style)': { m: 1.5, width: '30ch' },
//       }}
//       noValidate
//       autoComplete="off"
//     >
//       <TextField
//         id="outlined-controlled"
//         label="手机号"
//         value={name}
//         onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//           setName(event.target.value);
//         } } />
//       <TextField
//         id="outlined-uncontrolled"
//         label="验证码"
//         defaultValue="" />

//     </Box><Button variant="contained" endIcon={<SendIcon />}>
//         Send
//     </Button></>
//   );
// }
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DefaultHeader from "./header";
import { Path } from "../constant";

// function Copyright(props: any) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="记住密码"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to={Path.SiunUp}>忘记密码?</Link>
              </Grid>
              <Grid item>
                <Link to={Path.SiunUp}>{"没有账号？去注册"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
