"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import Loading from "../_components/Loading";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BlogPage = () => {
  const { data, error, isLoading } = useSWR(
    "https://dummyjson.com/products",
    fetcher
  );
  const router = useRouter();

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProductData, setNewProductData] = useState<any>({});

  if (error) return <div className="text-red-500">Failed to load products</div>;
  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  const products = data?.products || [];

  const handleAdd = async (newProduct: any) => {
    try {
      const response = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error(`Error adding product: ${response.statusText}`);
      }
      mutate("https://dummyjson.com/products");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch(
        `https://dummyjson.com/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProductData),
        }
      );
      if (!response.ok) {
        throw new Error(`Error updating product: ${response.statusText}`);
      }
      setEditingProduct(null);
      mutate("https://dummyjson.com/products");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error deleting product: ${response.statusText}`);
      }
      mutate("https://dummyjson.com/products");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="w-full lg:w-10/12 xl:w-8/12">
        <h1 className="text-4xl font-bold mb-6 text-gray-100">Products Blog</h1>

        {editingProduct && (
          <div className="mb-8 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              Edit Product
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={newProductData.title || editingProduct.title}
              onChange={(e) =>
                setNewProductData({ ...newProductData, title: e.target.value })
              }
              className="block mb-4 w-full p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newProductData.description || editingProduct.description}
              onChange={(e) =>
                setNewProductData({
                  ...newProductData,
                  description: e.target.value,
                })
              }
              className="block mb-4 w-full p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProductData.price || editingProduct.price}
              onChange={(e) =>
                setNewProductData({ ...newProductData, price: e.target.value })
              }
              className="block mb-4 w-full p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 text-gray-400 border-separate space-y-4 text-sm">
            <thead className="bg-gray-900 text-gray-500">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>

                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-gray-800 hover:bg-gray-700 transition cursor-pointer"
                >
                  <td className="p-3">
                    <div className="flex items-center">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <div className="text-gray-100 font-semibold">
                          {product.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3 font-bold">${product.price}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-gray-600 text-gray-50"
                          : "bg-red-500 text-gray-50"
                      }`}
                    >
                      {product.stock > 0 ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-3 flex items-center space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-gray-400 hover:text-gray-100"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-gray-400 hover:text-gray-100"
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
