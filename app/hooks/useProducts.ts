import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const useProducts = () => {
  const { data, error } = useSWR('https://dummyjson.com/products', fetcher);
  return { data, error };
};