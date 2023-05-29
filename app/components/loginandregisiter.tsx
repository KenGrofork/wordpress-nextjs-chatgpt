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
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MySnackbar from "./mysnackbar";
import axios, { AxiosResponse } from "axios";
import { getUserInfo, isUserLogin } from "../api/restapi/authuser";
import getServiceCount from "../api/restapi/servicecount";
import mixpanel from "mixpanel-browser";

mixpanel.init("6c4c1c926708fd247571a67ed0a25d6f", { debug: true });
const defaultTheme = createTheme();

export default function Login() {
  React.useEffect(() => {
    const res = isUserLogin();
    console.log(res);
    if (res) {
      setOpen(true);
      setMessage("您已登录，无需重复登录");
      setSeverity("warning");
      window.location.href = "/#/usercenter";
    }
  }, []);
  //定义用户名密码
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  const referrer = document.referrer;
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //提交时校验密码和手机号是否为空，如果为空则提示
    if (!/^1\d{10}$/.test(phone)) {
      // 手机号为空
      console.log("手机号为空");
      setOpen(true);
      setMessage("请输入11位手机号");
      setSeverity("warning");
      return; // 提前结束函数
    }
    if (password === "") {
      // 密码为空
      console.log("密码为空");
      setOpen(true);
      setMessage("请输入密码");
      setSeverity("warning");
      return; // 提前结束函数
    }
    //如果前方的校验都通过，则提交数据，请求后端接口
    try {
      const postData = {
        username: phone,
        password: password,
      };
      const response: AxiosResponse<any> = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`,
        postData,
      );
      console.log(response.data);
      localStorage.setItem("jwt_token", response.data.token);
      if (localStorage.getItem("jwt_token")) {
        console.log("token已经保存到本地");
        setOpen(true);
        setMessage("登录成功");
        setSeverity("success");
        mixpanel.track("Login in", {
          "Signup Type": "1",
          username: phone,
          referrer: referrer,
        });
        getServiceCount();
        getUserInfo();
        setTimeout(() => {
          window.location.href = "/#/usercenter";
          // window.location.reload();
        }, 1000);
      }
    } catch (error: unknown) {
      setOpen(true);
      setMessage("登录失败,请检查手机号或密码是否正确");
      setSeverity("error");
      console.log(error);
    }
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
            登录
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
              label="电话号码"
              name="phonenumber"
              autoComplete="phonenumber"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
                console.log(password);
              }}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              登录
            </Button>
            <MySnackbar
              open={open}
              handleClose={handleClose}
              severity={severity}
              message={message}
            />
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
