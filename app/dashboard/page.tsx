"use client";

import clsx from "clsx";
import Image from "next/image";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Loading from "../_components/Loading";
import { adminnavbarElements } from "../static/navbarelement";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Page = () => {
  const router = useRouter();
  const path = usePathname();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const { data, error } = useSWR("https://dummyjson.com/products", fetcher);

  if (error) return <div>Failed to load products</div>;
  if (!data)
    return (
      <div>
        <Loading />
      </div>
    );

  const products = data.products;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCookie("token", "", {
      expires: new Date(Date.now()),
    });
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:flex flex-col w-64 bg-gray-800">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-white font-bold uppercase">DummyJSON</span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-gray-800">
            {adminnavbarElements &&
              adminnavbarElements.map((element, index) => (
                <Link
                  key={index}
                  href={element.url}
                  className={clsx(
                    "flex items-center px-4 py-2 text-gray-100 rounded-md hover:bg-gray-700 transition duration-500",
                    path === element.url ? "bg-gray-700 my-3 " : null
                  )}
                >
                  <span className="px-2">{element.name}</span>
                </Link>
              ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="bg-[#111827] flex justify-end items-center text-white p-2 fixed w-[85%]">
          <Image
            className="rounded-full"
            src={userData.image}
            width={40}
            height={40}
            alt="User Profile Picture"
          />
          <button className="bg-gray-100 rounded w-9 h-9 mr-4 ml-4 border-2 border-blue-400 text-gray-900">
            {userData?.firstName.charAt(0)}
            {userData?.lastName.charAt(0)}
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-100 text-white-500 px-2 py-1 rounded border-2 border-blue-400 text-gray-900"
          >
            LogOut
          </button>
        </div>
        <div className="p-20 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow-md">
              <Image
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
                className="w-full h-40 object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-bold">{product.title}</h2>
              <p>{product.description}</p>
              <p className="text-blue-900 font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
