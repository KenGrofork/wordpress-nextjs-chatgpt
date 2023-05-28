import * as React from "react";
import { Path } from "../constant";
import { IconButton } from "./button";
import VipIcon from "../icons/vip.svg";
import LoginIcon from "../icons/login.svg";
import UserIcon from "../icons/user.svg";
import styles from "./home.module.scss";
import { useNavigate } from "react-router-dom";

// import { isUserLogin } from "../api/restapi/authuser";

interface BasicListProps {
  isLoggedIn: boolean;
}

export default function BasicList({ isLoggedIn }: BasicListProps) {
  const navigate = useNavigate();
  return (
    <div>
      {!isLoggedIn && (
        <div className={styles["sidebar-header-bar"]}>
          <IconButton
            icon={<LoginIcon />}
            text="注册&登录"
            className={styles["sidebar-bar-button"]}
            onClick={() => navigate(Path.SiunUp)}
            shadow
          />
        </div>
      )}
      {isLoggedIn && (
        <div className={styles["sidebar-header-bar"]}>
          <IconButton
            icon={<UserIcon />}
            text="用户中心"
            className={styles["sidebar-bar-button"]}
            onClick={() => navigate(Path.UserCenter)}
            shadow
          />
        </div>
      )}
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<VipIcon />}
          text="开通会员"
          className={styles["sidebar-bar-button"]}
          onClick={() => navigate(Path.Pricing)}
          shadow
        />
      </div>
      {/* <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<VipIcon />}
          text="test"
          className={styles["sidebar-bar-button"]}
          onClick={() => navigate(Path.HomePage)}
          shadow
        />
      </div> */}
    </div>
  );
}
