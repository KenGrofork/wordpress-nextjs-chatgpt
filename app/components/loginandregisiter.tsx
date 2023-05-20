import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const postData = {
        username,
        password,
      };
      const response: AxiosResponse<any> = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`,
        postData,
      );
      localStorage.setItem("jwt_token", response.data.token);
    } catch (error: unknown) {
      if ((error as AxiosError).response?.status === 400) {
        setError("用户名或密码错误");
        setShowError(true);
      } else {
        setError((error as AxiosError).message);
        setShowError(true);
      }
    }
  };

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
