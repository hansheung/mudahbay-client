import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getProductById, updateProduct } from "../api/products";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { addToCart } from "../api/carts";
import { HiOutlineChat } from "react-icons/hi";
import useCreateMessage from "../hooks/useCreateMessage";

const ProductDetail = ({ token }) => {
    const { id } = useParams(); // Extract product ID from URL
    const { loading, createMessage } = useCreateMessage();
    const navigate = useNavigate();
    const [preview, setPreview] = useState("");
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        image: "",
    });
    const [quantityData, setQuantityData] = useState(1);

    const { mutate: updateMutate } = useMutation({ mutationFn: updateProduct });
    const { mutate: addToCartMutate } = useMutation({ mutationFn: addToCart });

    const {
        data: product,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["product", id],
        queryFn: getProductById,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                category: product.category,
            });
        }
    }, [product]);

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

    const handleChangeQuantity = (e) => {
        setQuantityData(e.target.value);
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
                            title: "Updated Successful",
                            text: data.msg,
                            icon: "success",
                        });
                        return navigate("/");
                    }
                },
                onError: (error) => {
                    Swal.fire({ title: "Ooops!", text: error.response.data.msg, icon: "error" });
                    console.error(error.response.data.msg);
                },
            }
        );
    };

    const loginId = token ? jwtDecode(token).data._id : null;
    const isOwner = loginId === product.user;

    const handleAddToCart = async (e, id) => {
        e.preventDefault();

        if (parseInt(quantityData) > parseInt(product.quantity)) {
            return Swal.fire({
                title: "Exceed available quantity",
                text: "Quantity exceeded available quantity",
                icon: "warning",
            });
        }

        addToCartMutate(
            { productId: id, quantity: quantityData }, //{newQuantity: 5, item.product._id}
            {
                onSuccess: (data) => {
                    Swal.fire({
                        title: "Added to Cart Successful",
                        text: data.msg,
                        icon: "success",
                    });
                    return navigate("/");
                },
                onError: (error) => {
                    Swal.fire({ title: "Ooops!", text: error.response.data.msg, icon: "error" });
                    console.error(error.response.data.msg);
                },
            }
        );
    };

    const handleCreateChat = async (e) => {
        e.preventDefault();
        await createMessage(product.user, product._id);
        navigate("/chat");
        // window.location.reload();
    };

    return (
        <div>
            <main className="max-w-6xl mx-auto p-10 border mt-10">
                {isOwner ? (
                    <div>
                        <h1 className="text-4xl font-bold">Edit Item</h1>
                        <h2 className="text-xl font-semibold pt-5">Item Details</h2>
                        <p className="pb-5">By adding an item to the marketplace, you're listing your item for sale!</p>

                        <div className="flex flex-col justify-center items-center md:items-start md:flex-row md:space-x-5">
                            <img className="border h-80 w-80 object-contain mt-5" src={preview || `${process.env.REACT_APP_API_URL}/${product.image}`} alt="" />
                            <form className="flex flex-col flex-1 p-2 space-y-2" onSubmit={handleUpdate}>
                                <label className="font-light">Name of Item</label>
                                <input type="text" className="formField" placeholder="Name of item..." name="name" value={formData.name} onChange={handleChange} />
                                <label className="font-light">Description</label>
                                <textarea rows="4" className="border-2 border-gray-300 rounded-lg text-sm px-5 pr-5 outline-none" value={formData.description} placeholder="Enter Description..." name="description" onChange={handleChange} />
                                <label className="font-light">Price</label>
                                <input type="number" className="formField" placeholder="Enter Price" name="price" value={formData.price} onChange={handleChange} />
                                <label className="font-light">Quantity</label>
                                <input type="number" className="formField" placeholder="Enter Quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
                                <label className="font-light">Category</label>
                                <input type="text" className="formField" placeholder="Enter Category" name="category" value={formData.category} onChange={handleChange} />
                                <label className="font-light">Image of the Item</label>
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
                                    {/* <Link to="/">
                                        <button className="bg-gray-600 mt-10 text-white font-bold rounded-full px-10 py-3">Back to Products</button>
                                    </Link> */}
                                    <button type="submit" className="bg-green-600 mt-10 text-white font-bold rounded-full px-10 py-3 ml-auto">
                                        Update Item
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-4xl font-bold">{product.name}</h1>
                        <h2 className="text-xl font-semibold pt-5">Item Details</h2>
                        <p className="pb-5">This is the details of the product. Add to cart if you want to purchase</p>

                        <div className="flex flex-col justify-center items-center md:items-center md:flex-row md:space-x-5">
                            <img className="border h-80 w-80 object-contain" src={preview || `${process.env.REACT_APP_API_URL}/${product.image}`} alt="" />
                            <div className="flex flex-col flex-1 p-2 space-y-2">
                                <label className="font-light">Description</label>
                                <p> {product.description}</p>
                                <label className="font-light">Price</label>
                                <p> {product.price}</p>
                                <form onSubmit={(e) => handleAddToCart(e, product._id)}>
                                    <label className="font-light me-5">Quantity</label>
                                    {/* <input type="number" className="formField" placeholder="Enter Quantity" name="quantity" min={1} defaultValue={1} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} /> */}
                                    <input type="number" className="formField" placeholder="Enter Quantity" name="quantity" min={1} defaultValue={1} value={quantityData.quantity} onChange={handleChangeQuantity} />

                                    <div className="flex mt-10">
                                        <div className="flex flex-col space-y-3 ml-auto">
                                            <button className="bg-green-300 text-white font-bold rounded-full px-20 py-3" onClick={(e) => handleCreateChat(e)}>
                                                <div className="flex items-center space-x-1">
                                                    <HiOutlineChat className="h-7 w-7" />
                                                    <p>Chat with seller</p>
                                                </div>
                                            </button>
                                            <button type="submit" className="bg-blue-600 text-white font-bold rounded-full px-20 py-3">
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductDetail;
