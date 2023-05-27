import axios from "axios";

export default async function getServiceCount() {
  const userid = localStorage.getItem("user_info");
  if (!userid) {
    return "未登录";
  }
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/membership_info/v1/service-count?id=${userid}`,
  );
  console.log(response.data);
  localStorage.setItem("service_count", response.data.service_count);
  return response.data;
}
