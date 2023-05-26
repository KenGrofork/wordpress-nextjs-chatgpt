import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  // 其他属性
}

export async function GetProductData(productIds: number[]): Promise<Product[]> {
  try {
    const response = await axios.get(
      `https://chatgpt.funny-code.top/wp-json/wp/v2/product?include=${productIds.join(
        ",",
      )}`,
    );
    return response.data as Product[];
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
}

export async function getMenberInfo() {
  const userid = localStorage.getItem("user_info");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/membership_info/v1/user?user_id=${userid}`,
  );
  return response.data;
}

export async function getUserInfo() {
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
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
