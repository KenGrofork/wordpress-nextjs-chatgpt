// import * as React from "react";
// import Box from "@mui/material/Box";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
// import { Path } from "../constant";
// import { Link } from "react-router-dom";
// import { isUserLogin } from "../api/restapi/authuser";

// export default function BasicList() {
//   const [isLoggedIn, setIsLoggedIn] = React.useState(false);

//   React.useEffect(() => {
//     async function fetchData() {
//       const islogin = isUserLogin();
//       if (!islogin) {
//         setIsLoggedIn(false);
//         console.log(isLoggedIn);
//       }else{
//         setIsLoggedIn(true);
//         console.log(isLoggedIn);
//       }
//     }
//     fetchData();
//   }, []);

//   return (
//     <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
//       <nav aria-label="main mailbox folders">
//         <List>
//           {!isLoggedIn && (
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to={Path.Login}>
//                 <ListItemIcon>
//                   <LoginRoundedIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="登录&注册" />
//               </ListItemButton>
//             </ListItem>
//           )}
//           {isLoggedIn && (
//             <ListItem disablePadding>
//               <ListItemButton component={Link} to={Path.UserCenter}>
//                 <ListItemIcon>
//                   <AccountCircleIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="用户中心" />
//               </ListItemButton>
//             </ListItem>
//           )}
//           <ListItem disablePadding>
//             <ListItemButton component={Link} to={Path.Pricing}>
//               <ListItemIcon>
//                 <AccountCircleIcon />
//               </ListItemIcon>
//               <ListItemText primary="开通会员" />
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
import { Path } from "../constant";
import { Link } from "react-router-dom";
// import { isUserLogin } from "../api/restapi/authuser";

interface BasicListProps {
  isLoggedIn: boolean;
}

export default function BasicList({ isLoggedIn }: BasicListProps) {
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
