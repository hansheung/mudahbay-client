import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/users";
import Swal from "sweetalert2";
import { saveToken } from "../utils/authToken";
import Cookies from "js-cookie";

const Login = ({ setToken }) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const { mutate } = useMutation({ mutationFn: login });
    // const queryClient = useQueryClient();
    const onChangeHandler = (e) => setUser({ ...user, [e.target.name]: e.target.value });
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        mutate(user, {
            onSuccess: ({ data, status }) => {
                if (status >= 400) return Swal.fire({ title: "Ooops", text: data.msg, icon: "error" });
                if (data && status === 200) {
                    // setToken(data.token);

                    Swal.fire({
                        title: "Login Successful",
                        text: data.msg,
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        setToken(data.token);
                        Cookies.set("isAdmin", data.user.isAdmin, { expires: 1 });
                        saveToken(data.token);
                        if (result.isConfirmed) {
                            if (data.user.isAdmin) {
                                return navigate("/dashboard");
                            } else {
                                return navigate("/");
                            }
                        }
                    });
                }
            },
            onError: (error) => {
                Swal.fire({ title: "Ooops!", text: error.response.data.msg, icon: "error" });
                console.error(error.response.data.msg);
            },
        });
    };

    return (
        <>
            {/*
            This example requires updating your template:
    
            ```
            <html class="h-full bg-white">
            <body class="h-full">
            ```
          */}
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img alt="Your Company" src="/mudahbaylogocropped.png" className="mx-auto h-10 w-auto" />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" className="space-y-6" onSubmit={onSubmitHandler}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={onChangeHandler}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                {/* <div className="text-sm">
                                    <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div> */}
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={onChangeHandler}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{" "}
                        <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
