import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { deleteProduct } from "../api/products";

const SellingItem = ({ item, refetch }) => {
    const navigate = useNavigate();

    const { mutate: deleteMutate } = useMutation({ mutationFn: deleteProduct });

    const handleDeleteItem = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You are deleting this item",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutate(id, {
                    onSuccess: (data) => {
                        refetch();
                        alert(data.msg);
                    },
                    onError: (error) => alert(error.response.data.msg),
                });
            }
        });
    };
    console.log(item);

    return (
        <>
            {
                <tr className="odd:bg-white  even:bg-gray-50 ">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <img src={`${process.env.REACT_APP_API_URL}/${item.image}`} alt={item.name} className="w-10" />
                    </th>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">
                        {item.isActive? <p className="italic">Approved</p> : <p className="italic">Pending</p> }
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex space-x-2 items-center">
                            <button className="bg-green-600 text-white font-bold rounded-full px-5 py-3 ml-auto" onClick={() => navigate(`/productdetail/${item._id}`)}>
                                Edit listing
                            </button>

                            <button className="bg-red-600 text-white font-bold rounded-full px-5 py-3 ml-auto" onClick={() => handleDeleteItem(item._id)}>
                                Delete listing
                            </button>
                        </div>
                    </td>
                </tr>
            }
        </>
    );
};
export default SellingItem;
