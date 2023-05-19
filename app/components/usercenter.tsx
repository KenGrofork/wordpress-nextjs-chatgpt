import React from "react";
import UserInfo from "./userinfo";

function UserCenter() {
  return (
    <div className="user-center">
      <h2>欢迎来到用户中心</h2>
      <div className="user-info">
        <img src="https://via.placeholder.com/150" alt="user avatar" />
        <div className="user-details">
          <h3>用户名</h3>
          <p>Email: user@example.com</p>
          <p>电话: 123-456-7890</p>
        </div>
      </div>
      <div className="menu-options">
        <ul>
          <li>
            <a href="#">个人信息</a>
          </li>
          <li>
            <a href="#">账户设置</a>
          </li>
          <li>
            <a href="#">退出登录</a>
          </li>
        </ul>
      </div>
      <UserInfo />
    </div>
  );
}

export default UserCenter;
