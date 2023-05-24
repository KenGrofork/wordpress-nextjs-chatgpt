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
