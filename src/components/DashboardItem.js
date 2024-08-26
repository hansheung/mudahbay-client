import { useMutation } from "@tanstack/react-query";
import { approveProduct } from "../api/products";
import Swal from "sweetalert2";
import { fetchAvgRating } from "../api/reviews";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineChat } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useCreateMessage from "../hooks/useCreateMessage";

const DashboardItem = ({ item, refetch }) => {
    const { mutate: approveMutate } = useMutation({ mutationFn: approveProduct });
    const { data } = useQuery({ queryKey: ["review", item.user._id], queryFn: fetchAvgRating });
    const navigate = useNavigate();
    const { loading, createMessage } = useCreateMessage();
    const handleApprove = (productId) => {
        // console.log(productId)
        // return;
        approveMutate(
            { productId },
            {
                onSuccess: (data) => {
                    Swal.fire({
                        title: "Item Approved",
                        text: data.msg,
                        icon: "success",
                    });
                    refetch();
                },
                onError: (error) => alert(error.response.data.msg),
            }
        );
    };

    const handleCreateChat = async (e) => {
        e.preventDefault();
        await createMessage(item.user._id, item._id);
        navigate("/chat");
        // window.location.reload();
    };

    // const avgRating = data.avg;
    const maxStars = 5;
    const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

    return (
        <>
            {
                <tr className="odd:bg-white  even:bg-gray-50 ">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <img src={`${process.env.REACT_APP_API_URL}/${item.image}`} alt={item.name} className="w-10" />
                    </th>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item.price}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col items-start justify-start space-x-5">
                            <p className="ms-5">{item.user.fullname}</p>
                            <h1>{data?.avg}</h1>
                            <div className="flex">
                                {stars.map((star) => (
                                    <svg
                                        key={star}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={star <= data?.avg ? "currentColor" : "none"}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className={`w-6 h-6 ${star <= data?.avg ? "text-yellow-500" : "text-gray-300"}`}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-400 italic">{data?.avg?.toFixed(1) || 0} out of 5</p>
                        </div>
                    </td>

                    <td className="px-6 py-4">
                        <div className="flex space-x-3 ml-auto">
                            <button className="bg-green-300 text-white font-bold rounded-full px-5 py-3 hover:underline" onClick={(e) => handleCreateChat(e)}>
                                <div className="flex items-center space-x-1">
                                    <HiOutlineChat className="h-7 w-7" />
                                    <p className="text-nowrap">Chat with seller</p>
                                </div>
                            </button>
                            <button className="bg-orange-600 text-white font-bold rounded-full px-5 hover:underline" onClick={() => handleApprove(item._id)}>
                                Approve
                            </button>
                        </div>
                    </td>
                </tr>
            }
        </>
    );
};
export default DashboardItem;
