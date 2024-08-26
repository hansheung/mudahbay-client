import { useQuery, useMutation } from "@tanstack/react-query";
import { getCart } from "../api/carts";
import CartItem from "../components/CartItem";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { checkout } from "../api/orders";
import { formatCurrency } from "../utils/formatCurrency";

const Cart = () => {
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["items"],
        queryFn: getCart,
    });
    
    const { mutate: checkoutMutate } = useMutation({ mutationFn: checkout });

    if (isLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (error) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;

    let total = 0;
    if (data?.items?.length > 0) {
        for (let i = 0; i < data.items.length; i++) {
            total += data.items[i].quantity * data.items[i].product.price;
        }
    }

    const handleCheckOut = (total) => {
        checkoutMutate(
            { total },
            {
                onSuccess: (data) => {
                    Swal.fire({
                        title: "Checkout complete",
                        text: data.msg,
                        icon: "success",
                    });
                    navigate("/");
                },
                onError: (error) => alert(error.response.data.msg),
            }
        );
    };

    return (
        <>
            <main className="max-w-6xl mx-auto p-10 border mt-10">
                <h1 className="text-4xl font-bold">My Cart</h1>
                <h2 className="text-xl font-semibold pt-5">You can delete, add quantity or checkout in your cart</h2>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                    {data?.items?.length > 0 ? (
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Item Image
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Quantity
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Subtotal
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item) => (
                                    <CartItem item={item} key={item._id} refetch={refetch} />
                                ))}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="px-6 py-4 text-lg font-bold">Total</td>
                                    <td class="px-6 py-4">{formatCurrency(total)}</td>
                                    <td class="px-6 py-4">
                                        <button className="bg-blue-600 text-white font-bold rounded-full px-5 py-2" onClick={() => handleCheckOut(total)}>
                                            Checkout
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <h2 className="text-center animate-pulse text-blue-700 text-lg my-10">Your cart is empty</h2>
                    )}
                </div>
            </main>
        </>
    );
};

export default Cart;
