import {
  getAllProductsService,
  getProductBySlugService,
} from "@/services/product.service";
import { getProductByIdService } from "@/services/product.service";


export const getAllProductsController = async () => {
  try {
    const products = await getAllProductsService();

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch products",
    };
  }
};
export const getProductByIdController = async (id: string) => {
  try {
    const product = await getProductByIdService(id);

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("ID error:", error);
    return { success: false, message: "Error fetching product by ID" };
  }
};

export const getProductBySlugController = async (slug: string) => {
  try {
    console.log("Fetching product with slug:", slug);

    const product = await getProductBySlugService(slug);

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Slug error:", error);
    return { success: false, message: "Error fetching product" };
  }
};