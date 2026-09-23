import api from "../lib/axios";

export const getProducts = async (limit, skip) => {
  const response = await api.get("/products", {
    params: {
      limit,
      skip,
    },
  });

  return response.data;
};

export const searchProducts = async (query, limit, skip) => {
  const response = await api.get("/products/search", {
    params: {
      q: query,
      limit,
      skip,
    },
  });

  return response.data;
};

export const getProductsByCategory = async (
  category,
  limit,
  skip
) => {
  const response = await api.get(
    `/products/category/${category}`,
    {
      params: {
        limit,
        skip,
      },
    }
  );

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get(
    "/products/categories"
  );

  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(
    `/products/${id}`
  );

  return response.data;
};

export const addProduct = async (product) => {
  const response = await api.post(
    "/products/add",
    product
  );

  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(
    `/products/${id}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};