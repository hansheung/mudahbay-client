import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { updateUser, getUser } from "../api/users";

const User = ({ token }) => {
    const { id } = useParams(); // Extract user ID from URL
    const navigate = useNavigate();
    const [preview, setPreview] = useState("");
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        image: "",
    });

    const { mutate: updateMutate } = useMutation({ mutationFn: updateUser });

    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["user", id],
        queryFn: getUser,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname,
                email: user.email,
            });
        }
    }, [user]);

    if (isLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (error) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        // console.log(name);
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleUpdate = (e) => {
        // console.log("Hello did it come here?")
        e.preventDefault();
        updateMutate(
            { id, formData },
            {
                onSuccess: ({ data, status }) => {
                    if (data && status === 200) {
                        Swal.fire({
                            title: "User updated Successful",
                            text: data.msg,
                            icon: "success",
                        });
                        navigate("/");
                        window.location.reload();
                    }
                },
                onError: (error) => {
                    Swal.fire({ title: "Ooops!", text: error.response.data.msg, icon: "error" });
                    console.error(error.response.data.msg);
                },
            }
        );
    };

    return (
        <div>
            <main className="max-w-6xl mx-auto p-10 border mt-10">
                <div>
                    <h1 className="text-4xl font-bold">Edit User Profile</h1>
                    <h2 className="text-xl font-semibold pt-5">User Details</h2>
                    <p className="pb-5">You can edit your user profile here. Leave the password blank unless you want to change it</p>

                    <div className="flex flex-col justify-center items-center md:items-start md:flex-row md:space-x-5">
                        <img className="border h-80 w-80 object-contain mt-5" src={preview || (user?.image ? `${process.env.REACT_APP_API_URL}/user/${user.image}` : `${process.env.REACT_APP_API_URL}/user/default-profile.png`)} alt="" />
                        <form className="flex flex-col flex-1 p-2 space-y-2" onSubmit={handleUpdate}>
                            <label className="font-light">Fullname</label>
                            <input type="text" className="formField" placeholder="Full name..." name="fullname" value={formData.fullname} onChange={handleChange} />
                            <label className="font-light">Email</label>
                            <input type="email" className="formField" placeholder="Enter Email..." name="email" value={formData.email} onChange={handleChange} />
                            <label className="font-light">Password</label>
                            <input type="password" className="formField" placeholder="Enter Password..." name="password" onChange={handleChange} />
                            <label className="font-light">Confirm Password</label>
                            <input type="password" className="formField" placeholder="Confirm your password" name="password2" />
                            <label className="font-light">Profile Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setPreview(URL.createObjectURL(e.target.files[0]));
                                        setImage(e.target.files[0]);
                                    }
                                    handleChange(e);
                                }}
                            />

                            <div className="flex ml-auto space-x-3">
                                
                                <button type="submit" className="bg-green-600 mt-10 text-white font-bold rounded-full px-10 py-3 ml-auto">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default User;
