import axios from "axios";

async function getUserInfo() {
  const token = localStorage.getItem("jwt_token");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/users/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  console.log(response.data);
  localStorage.setItem("user_info", response.data.id);
}
export default getUserInfo;
