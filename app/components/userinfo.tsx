import axios from "axios";
import { useEffect, useState } from "react";

const token = localStorage.getItem("jwt_token"); // 从本地存储中获取 JWT 访问令牌

function UserInfo() {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get("https://chatgpt.funny-code.top/wp-json/wp/v2/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div>
      <h2>User Info</h2>
      <ul>
        <li>Username: {user.slug}</li>
        <li>Email: {user.email}</li>
      </ul>
    </div>
  );
}

export default UserInfo;
