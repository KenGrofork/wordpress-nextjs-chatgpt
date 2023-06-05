import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DefaultHeader from "./header";
import { useEffect, useState } from "react";
import axios from "axios";
import MySnackbar from "./mysnackbar";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { isUserLogin } from "../api/restapi/authuser";
import mixpanel from "mixpanel-browser";
import { sendInviteCode } from "../api/restapi/restapi";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
mixpanel.init("6c4c1c926708fd247571a67ed0a25d6f", { debug: true });

export default function SignUp() {
  React.useEffect(() => {
    const res = isUserLogin();
    console.log(res);
    if (res) {
      setOpen(true);
      setMessage("请先退出登录");
      setSeverity("warning");
      window.location.href = "/#/usercenter";
    }
  }, []);

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
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [showPassword, setShowPassword] = useState(true);
  const [invitecode, setInvitecode] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shareCode = searchParams.get("sharecode");

  React.useEffect(() => {
    if (shareCode) {
      console.log("sharecode:", shareCode);

      setInvitecode(shareCode);
    }
  }, [shareCode]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const sendSmsVerificationCode = async () => {
    if (!/^1\d{10}$/.test(phone)) {
      // 手机号为空
      console.log("手机号为空");
      setOpen(true);
      setMessage("请输入11位手机号");
      setSeverity("warning");
      return; // 提前结束函数
    }

    try {
      // 首先检查手机号是否已注册
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/mytheme/v1/check-username`,
        {
          params: {
            username: phone,
          },
        },
      );
      console.log(response);
      if (response.data) {
        console.log("当前手机号已注册");
        setOpen(true);
        setMessage("当前手机号已注册");
        setSeverity("warning");
        return;
      }

      // 发送验证码
      handleSendVerificationCodeButtonClick();
      const response2 = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/myplugin/v1/sms-send`,
        { phone: phone },
      );
      setOpen(true);
      setMessage(response2.data.status);
      setSeverity("info");
    } catch (error) {
      console.error(error);
    }
  };

  //注册表单&请求注册接口
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    //请求验证接口获取返回值
    if (!/^1\d{10}$/.test(phone) || !password) {
      console.log("请输入完整信息");
      setOpen(true);
      setMessage("请输入正确信息");
      setSeverity("warning");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/myplugin/v1/verify-sms-code`,
        { params: { phone: phone, code: code } },
      );
      console.log(response);
      const verificationStatus = response.data; //定义一个变量接收返回状态
      console.log(verificationStatus);

      if (verificationStatus) {
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

        console.log(response.data.id);
        localStorage.setItem("user_info", response.data.id);

        // 获取 token 保存本地
        const tokenResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`,
          {
            username: username,
            password: password,
          },
        );

        console.log(tokenResponse);
        localStorage.setItem("jwt_token", tokenResponse.data.token);
        if (tokenResponse.data.token) {
          if (invitecode != "") {
            sendInviteCode(invitecode);
          }
          setOpen(true);
          setMessage("注册成功");
          setSeverity("success");
          localStorage.setItem("service_count", "10");

          mixpanel.track("Signed Up", {
            "Signup Type": "Referral",
          });
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setOpen(true);
          setMessage(tokenResponse.data.message);
          setSeverity("error");
        }
        // 跳转到登录页
      } else {
        console.log("验证码验证失败！");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
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
          <Typography variant="subtitle1">
            现在注册可获得免费使用权益
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
                  id="phone-number"
                  label="手机号"
                  name="phone number"
                  autoComplete="phone number"
                  inputProps={{
                    maxLength: 11,
                    pattern: "[0-9]{11}",
                  }}
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
                      id="code"
                      label="输入手机验证码"
                      inputProps={{
                        maxLength: 4,
                        pattern: "[0-9]{4}",
                      }}
                      name="code"
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {!isCounting && (
                      <Button
                        variant="contained"
                        onClick={() => {
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
                  type={showPassword ? "text" : "password"} // 控制密码是否显示
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  // required
                  fullWidth
                  name="password"
                  label="邀请码[选填]"
                  type={showPassword ? "text" : "password"} // 控制密码是否显示
                  id="password"
                  autoComplete="new-password"
                  value={invitecode}
                  onChange={(e) => setInvitecode(e.target.value)}
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">
                  //       <IconButton
                  //         aria-label="toggle password visibility"
                  //         onClick={() => setShowPassword(!showPassword)}
                  //         onMouseDown={(e) => e.preventDefault()}
                  //       >
                  //         {showPassword ? <Visibility /> : <VisibilityOff />}
                  //       </IconButton>
                  //     </InputAdornment>
                  //   ),
                  // }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              提交注册
            </Button>
            <MySnackbar
              open={open}
              handleClose={handleClose}
              severity={severity}
              message={message}
            />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/loginandregisiter">已有账户？去登录</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
