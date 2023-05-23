import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  createTheme,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import MySnackbar from "./mysnackbar";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";
import { IconButton } from "./button";
import { ThemeProvider } from "@emotion/react";
import axios from "axios";

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
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });

  //获取用户信息
  const getUserInfo = async () => {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/users/me`,
        config,
      );
      console.log(response.data);
      setUserInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getUserInfo();
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
    }, 500);

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
    // setOpen(true);
    // setMessage("已退出登录");
    // setSeverity("message");
    setTimeout(() => {
      navigate("/");
    }, 1000);
    console.log(localStorage.getItem("jwt_token"));
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">个人中心</div>
          {/* <div className="window-header-sub-title">加入我们开始AIChat</div> */}
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
      <StyledContainer maxWidth="md">
        <UserInfo>
          <Avatar alt="User Avatar" src="/path/to/avatar.jpg" />
          <Typography variant="h6" component="div" marginLeft={2}>
            User_{userInfo.name}
          </Typography>
        </UserInfo>
        <List>
          <ListItem>
            <ListItemText primary="Email" secondary={userInfo.name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="电话" secondary={userInfo.email} />
          </ListItem>
        </List>
        <ProgressContainer>
          <Typography variant="body1">到期时间</Typography>
          <Box sx={{ width: "60%" }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Typography variant="body1">剩余13天</Typography>
        </ProgressContainer>
        <Button variant="contained" onClick={handleLogout}>
          退出登录
        </Button>
        <MySnackbar
          open={open}
          handleClose={handleClose}
          severity={severity}
          message={message}
        />
      </StyledContainer>
    </ThemeProvider>
  );
};

export default UserCenter;
