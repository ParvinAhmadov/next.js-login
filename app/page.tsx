"use client";
import { Vortex } from "react-loader-spinner";
import { useFormik } from "formik";
import { useRequestMutation } from "./_http/axiosFetcher";
import * as yup from "yup";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const LoginValidationSchema = yup.object({
  username: yup.string().trim().required("Username is required"),
  password: yup.string().trim().required("Password is required"),
});

export default function Home() {
  const router = useRouter();
  const {
    trigger: loginservice,
    isMutating: loading,
    error: isErr,
  } = useRequestMutation("login", {
    method: "POST",
    module: "devApi",
  });

  const InitialForm = {
    username: "",
    password: "",
    expiresInMins: 30,
  };

  const formik = useFormik({
    initialValues: InitialForm,
    validationSchema: LoginValidationSchema,
    onSubmit: async (values) => {
      loginservice({
        body: values,
      }).then((res) => {
        setCookie("token", res.token, {
          expires: new Date(Date.now() + values.expiresInMins * 60000),
        });
        setCookie("user", res, {
          expires: new Date(Date.now() + values.expiresInMins * 60000),
        });
        localStorage.setItem("user", JSON.stringify(res));
        if (res.token && res) {
          router.push("/dashboard");
        }
      });
    },
  });

  return (
    <main>
      {isErr && (
        <button className="bg-red-600 text-white rounded  shadow-lg px-4 absolute left-[15%] top-[10%]">
          {isErr.message}
        </button>
      )}
      <section>
        <div className="grid md:h-screen md:grid-cols-2">
          <div className="flex flex-col items-center justify-center bg-white">
            <div className="max-w-lg px-5 py-16 text-center md:px-10 md:py-24 lg:py-32">
              <h2 className="mb-8 text-3xl font-bold md:mb-12 md:text-5xl">
               Products Dashboard
              </h2>
              <form
                id="login"
                onSubmit={formik.handleSubmit}
                className="mx-auto mb-4 max-w-sm pb-4"
              >
                <div className="relative">
                  <img
                    alt="Username Icon"
                    src="https://getdrawings.com/free-icon-bw/username-icon-9.png"
                    className="absolute bottom-0 left-[5%] w-[24px] right-auto top-[26%] inline-block"
                  />
                  <input
                    type="text"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="username"
                    className=" block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                    placeholder="Username"
                  />
                  {formik.errors.username && formik.touched.username ? (
                    <p className="text-red-500 text-sm flex">
                      {formik.errors.username}
                    </p>
                  ) : null}
                </div>
                <div className="relative mb-4">
                  <img
                    alt="Password Icon"
                    src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg"
                    className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block"
                  />
                  <input
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="password"
                    className=" mt-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                    placeholder="Password"
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <p className="text-red-500 text-sm flex">
                      {formik.errors.password}
                    </p>
                  ) : null}
                </div>
                <label className="mb-6 flex items-center pb-12 font-medium lg:mb-1">
                  <input type="checkbox" name="checkbox" />
                  <span className="ml-4 inline-block cursor-pointer text-sm">
                    I agree with the{" "}
                    <a href="#" className="font-bold text-[#0b0b1f]">
                      Terms &amp; Conditions
                    </a>
                  </span>
                </label>
                <button
                  type="submit"
                  id="login"
                  disabled={loading}
                  className="flex gap-2 items-center justify-center bg-[#276ef1] w-full px-8 py-4 text-center font-semibold text-white transition [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px]"
                >
                  {loading ? (
                    <Vortex width={35} height={35} />
                  ) : (
                    <>
                      Login
                      <svg
                        className="h-4 w-4 flex-none"
                        fill="currentColor"
                        viewBox="0 0 20 21"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Arrow Right</title>
                        <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
                      </svg>
                    </>
                  )}
                </button>
              </form>
              <p className="text-sm text-[#636262]">
                Already have an account?{" "}
                <a href="#" className="text-sm font-bold text-black">
                  Login now
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#f2f2f7]">
            <div className="max-w-lg px-5 py-16 md:px-10 md:py-24 lg:py-32">
              <div className="mb-6 ml-2 flex h-14 w-14 items-center justify-center bg-[#276ef1] [box-shadow:rgb(171,_196,_245)_-8px_8px]">
                <img
                  src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6358f5ec37c8c32b17d1c725_Vector-9.svg"
                  alt="Vector Icon"
                  className="inline-block"
                />
              </div>
              <p className="mb-8 text-[#647084] md:mb-12 lg:mb-16">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                aliquam, purus sit amet luctus venenatis, lectus magna fringilla
                urna, porttitor rhoncus dolor purus non enim.
              </p>
              <p className="font-bold">Parvin Ahmadov</p>
              <p className="text-sm">Web Developer</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
