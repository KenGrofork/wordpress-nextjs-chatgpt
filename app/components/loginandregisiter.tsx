import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 添加登录状态

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  // 验证用户身份
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/api/v1/token`,
        {
          username,
          password,
        },
      );
      localStorage.setItem("jwt_token", response.data.jwt_token);
      setIsLoggedIn(true); //用户已登录
      setTimeout(() => window.location.reload(), 2000); //2秒后刷新页面
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("用户名或密码错误");
        setShowError(true);
        setInterval(() => setShowError(false), 2000);
      } else {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    if (showError) {
      setInterval(() => setShowError(false), 2000);
    }
  }, [showError]);

  useEffect(() => {
    if (isLoggedIn) {
      //登录成功后的逻辑，弹出一个提示信息
      alert("登录成功！");
    }
  }, [isLoggedIn]);

  return (
    <div className="login-model">
      {showError && <p className="error-model">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="username-lable">
          用户名:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <label>
          密码:
          <input
            className="password-lable"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <button className="submit-button" type="submit">
          提交
        </button>
      </form>
    </div>
  );
}

export default Login;
