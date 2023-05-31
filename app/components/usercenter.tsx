import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  createTheme,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import MySnackbar from "./mysnackbar";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";
import { IconButton } from "./button";
import { ThemeProvider } from "@emotion/react";
import DataGridDemo from "./orderlist";
import { getMenberInfo, getUserInfo } from "../api/restapi/restapi";
import { isUserLogin } from "../api/restapi/authuser";
import getServiceCount from "../api/restapi/servicecount";
import { isMember } from "../api/restapi/ismember";
import ShareComponent from "./share";

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const UserCenter = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const navigate = useNavigate();
  const defaultTheme = createTheme();
  const [progress, setProgress] = React.useState(0);
  //调用后端接口获取用户信息
  const [username, setUsername] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [sharecode, setSharecode] = useState("");
  //调用isuserlogin函数判断用户是否登录，未登录跳转到登录页面
  React.useEffect(() => {
    isMember();
    const islogin = isUserLogin();
    console.log(islogin);
    if (!islogin) {
      navigate(Path.Login);
      return;
    } else {
      fetchData1();
      fetchData2();
      getServiceCount();
    }
    async function fetchData1() {
      const myuserInfo = await getUserInfo();
      setUsername(myuserInfo.name);
      setSharecode(myuserInfo.name);
      setShareLink(
        `https://gpt.funny-code.top/#/signup?sharecode=${myuserInfo.name}`,
      );
    }
    async function fetchData2() {
      getMenberInfo();
    }
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 1;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleLogout = () => {
    // 实现退出登录逻辑
    //点击按钮时清除本地存储中的jwt_token，然后跳转到登录页
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("service_count");
    localStorage.removeItem("ismember");
    // setOpen(true);
    // setMessage("已退出登录");
    // setSeverity("message");
    setTimeout(() => {
      navigate("/loginandregisiter");
    }, 1000);
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">个人中心</div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
            />
          </div>
        </div>
      </div>
      <StyledContainer maxWidth="md" style={{ overflowY: "auto" }}>
        <StyledContainer maxWidth="md">
          <UserInfo>
            <Avatar alt="User Avatar" src="/path/to/avatar.jpg" />
            <Typography variant="h6" component="div" marginLeft={2}>
              User_{username}
            </Typography>
          </UserInfo>
          {/* <ProgressContainer>
          <Typography variant="body1">到期时间</Typography>
          <Box sx={{ width: "60%" }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Typography variant="body1">剩余13天</Typography>
        </ProgressContainer> */}
          <DataGridDemo />
          <ShareComponent shareLink={shareLink} shareCode={sharecode} />
          <Grid item sx={{ mt: 10 }}>
            <Button
              size="large"
              color="primary"
              variant="contained"
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </Grid>
          <MySnackbar
            open={open}
            handleClose={handleClose}
            severity={severity}
            message={message}
          />
        </StyledContainer>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default UserCenter;
