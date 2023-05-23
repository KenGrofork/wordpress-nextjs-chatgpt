// import * as React from 'react';
// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
// import path from 'path';
// import { Path } from '../constant';
// import { Link } from 'react-router-dom';

// export default function BasicList() {
//   return (
//     <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
//       <nav aria-label="main mailbox folders">
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton component={Link} to={Path.Login}>
//               <ListItemIcon >
//                 <LoginRoundedIcon />
//               </ListItemIcon>
//               <ListItemText primary="登录&注册" />
//             </ListItemButton>
//           </ListItem>
//           <ListItem disablePadding>
//             <ListItemButton component={Link} to={Path.UserCenter}>
//               <ListItemIcon>
//                 <AccountCircleIcon />
//               </ListItemIcon>
//               <ListItemText primary="用户中心" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </nav>
//     </Box>
//   );
// }

import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import path from "path";
import { Path } from "../constant";
import { Link } from "react-router-dom";
import axios from "axios";

export default function BasicList() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .post(
        "https://chatgpt.funny-code.top/wp-json/jwt-auth/v1/token/validate",
        null,
        config,
      )

      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders">
        <List>
          {!isLoggedIn && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to={Path.Login}>
                <ListItemIcon>
                  <LoginRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="登录&注册" />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to={Path.UserCenter}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="用户中心" />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton component={Link} to={Path.Pricing}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="开通会员" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
