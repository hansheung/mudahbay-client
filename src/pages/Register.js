import { useState } from "react";
import Swal from "sweetalert2";
import {registerUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"; 

const Register = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const { mutate } = useMutation({ mutationFn: registerUser });
    const onChangeHandler = (e) => setUser({...user, [e.target.name]: e.target.value});

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        // if (user.password !== user.password2) return Swal.fire({ title: "Ooops", text: "Password should match", icon: "warning" });

        mutate(user, {
            onSuccess: ({ data, status }) => {
                if (status >= 400) Swal.fire({ title: "Ooops", text: data.msg, icon: "error" });
                if (data && status === 200) {
                    Swal.fire({
                        title: "Congratulation",
                        text: data.msg,
                        icon: "success",
                    });

                    navigate("/login");
                }
            },
            onError: (error) => {
                Swal.fire({title: "Ooops!", text: error.response.data.msg, icon: "error" });
                console.error(error.response.data.msg)}
        });
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img alt="Mudah Bay" src="/mudahbaylogocropped.png" className="mx-auto h-10 w-auto" />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register an account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form method="POST" className="space-y-6" onSubmit={onSubmitHandler}>
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900">
                                Full name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={onChangeHandler} 
                               />
                            </div>

                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 mt-2">
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
                            <div className="flex items-center justify-between mt-2">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
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
                            <div className="flex items-center justify-between mt-2">
                                <label htmlFor="password2" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password2"
                                    name="password2"
                                    type="password"
                                    required
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
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
