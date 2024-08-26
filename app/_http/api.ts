import { useRequestMutation } from "./axiosFetcher";

export const api = {
  devApi: {
    baseUrl: "https://dummyjson.com",
    login: "auth/login",
    get: 'products',
        add: 'products/add',
        update: (id: number) => `products/${id}`,
        delete: (id: number) => `products/${id}`,
  },
};




