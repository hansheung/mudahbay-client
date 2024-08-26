import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { updateCart, deleteItem } from "../api/carts";
import Swal from "sweetalert2";
import { formatCurrency } from "../utils/formatCurrency";

const CartItem = ({ item, refetch }) => {
    const [formData, setFormData] = useState({ quantity: item.quantity });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { mutate: updateMutate } = useMutation({ mutationFn: updateCart });
    const { mutate: deleteMutate } = useMutation({ mutationFn: deleteItem });

    const handleToCart = async (operation) => {
        let newQuantity = formData.quantity;

        if (operation === "minus" && formData.quantity > 1) {
            newQuantity = parseInt(newQuantity) - 1;
        } else if (operation === "plus") {
            if (parseInt(newQuantity) < parseInt(item.product.quantity)) {
                newQuantity = parseInt(newQuantity) + 1;
            } else {
                return  Swal.fire({
                    title: "Cannot exceed total quantity",
                    text: "Quantity exceed total quantity",
                    icon: "warning"
                });
                
            }
        }

        setFormData({ ...formData, quantity: newQuantity });

        updateMutate(
            { id: item.product._id, quantity: newQuantity }, //{newQuantity: 5, item.product._id}
            {
                onSuccess: (data) => {
                    Swal.fire({
                        title: "Update Successful",
                        text: data.msg,
                        icon: "success"
                    })

                    refetch();
                },
                onError: (error) => alert(error.response.data.msg),
            }
        );
    };

    const handleDeleteItem = (id) => {
        deleteMutate(
            { id },
            {
                onSuccess: (data) => {
                    Swal.fire({
                        title: "Item Deleted Successful",
                        text: data.msg,
                        icon: "success",
                    });
                    refetch();
                },
                onError: (error) => alert(error.response.data.msg),
            }
        );
    };

    const subtotal = parseFloat(item.product.price) * parseInt(formData.quantity);

    return (
        <>
            <tr className="odd:bg-white  even:bg-gray-50 ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <img src={`${process.env.REACT_APP_API_URL}/${item.product.image}`} alt={item.product.name} className="w-10" />
                </th>
                <td className="px-6 py-4">{item.product.name}</td>
                <td className="px-6 py-4">{formatCurrency(item.product.price)}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        {formData.quantity === 1 ?(<button disabled className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l focus:outline-none" onClick={() => handleToCart("minus")}>
                            <span>-</span>
                        </button>):(<button className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l focus:outline-none" onClick={() => handleToCart("minus")}>
                            <span>-</span>
                        </button>)}
                        
                        <input type="text" min={1} value={formData.quantity} className="w-12 text-center bg-white border border-gray-300 py-1" name="quantity" onChange={handleChange} />
                        <button className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r focus:outline-none" onClick={() => handleToCart("plus")}>
                            <span>+</span>
                        </button>
                    </div>
                </td>
                <td className="px-6 py-4">{formatCurrency(subtotal)}</td>
                <td className="px-6 py-4">
                    <button className="font-medium text-red-600 hover:underline" onClick={() => handleDeleteItem(item.product._id)}>
                        Delete
                    </button>
                </td>
            </tr>
        </>
    );
};

export default CartItem;
