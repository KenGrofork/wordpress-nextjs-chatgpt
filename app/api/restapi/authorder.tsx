import axios from "axios";

async function getOrderStatus(orderId: number) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wc/v3/orders/${orderId}`,
    {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}` },
    },
  );
  localStorage.setItem("order_status", response.data.id);
  console.log(response.data.status);
  const order_status = response.data.status;
  return order_status;
}
export default getOrderStatus;
