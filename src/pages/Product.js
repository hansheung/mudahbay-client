import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addProduct } from "../api/products";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Product = () => {
    const navigate = useNavigate();
    const [preview, setPreview] = useState("")
    const [image, setImage] = useState(null)
    const { mutate: submitMutate } = useMutation({ mutationFn: addProduct });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        image: null,
    });
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = (e) =>{
        // console.log("Hello did it come here?")
        e.preventDefault();
        submitMutate(formData, 
            {   onSuccess: ({ data, status }) => {
                if (data && status === 200) {
                        Swal.fire({
                        title: "Product Added Successful",
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
        });
    }

    return (
        <div>
            <main className="max-w-6xl mx-auto p-10 border mt-10">
                <h1 className="text-4xl font-bold">Add an item to the Market place</h1>
                <h2 className="text-xl font-semibold pt-5">Item Details</h2>
                <p className="pb-5">By adding an item to the marketplace, you're lising your item for sale!</p>

                <div className="flex flex-col justify-center items-center md:items-start md:flex-row md:space-x-5">
                    <img className="border h-80 w-80 object-contain mt-5" src={preview || "https://links.papareact.com/ucj"} alt="" />
                    <form className="flex flex-col flex-1 p-2 space-y-2" onSubmit={handleSubmit}>
                        <label className="font-light">Name of Item</label>
                        <input type="text" required className="formField" placeholder="Name of item..." name="name" onChange={handleChange} />
                        <label className="font-light">Description</label>
                        <textarea rows="4" className="border-2 border-gray-300 rounded-lg text-sm px-5 pr-5 outline-none" placeholder="Enter Description..." name="description" onChange={handleChange} />
                        <label className="font-light">Price</label>
                        <input type="number" required className="formField" placeholder="Enter Price" name="price" onChange={handleChange} />
                        <label className="font-light">Quantity</label>
                        <input type="number" required className="formField" placeholder="Enter Quantity" name="quantity" onChange={handleChange} />
                        <label className="font-light">Category</label>
                        <input type="text" className="formField" placeholder="Enter Category" name="category" onChange={handleChange} />
                        <label className="font-light">Image of the Item</label>
                        <input type="file" name="image"  
                            onChange = {(e) =>{
                                if(e.target.files?.[0]){
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                    setImage(e.target.files[0])
                                }
                                handleChange(e);
                            }}
                        />
                        <button type="submit" className="bg-blue-600 text-white font-bold rounded-full px-20 py-5 ml-auto">Add Item</button>
                    </form>
                    
                </div>
                
            </main>
        </div>
    );
};

export default Product;
