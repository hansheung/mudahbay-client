import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProductsAdmin } from "../api/products";
import DashboardItem from "../components/DashboardItem";
import { isAdmin } from "../utils/authToken";
import { useEffect } from "react";

const Dashboard = () => {
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["products"],
        queryFn: getProductsAdmin,
    });

    
    useEffect(() => {
        if (!isAdmin())  {
            alert("You are not an admin")
            return navigate("/");
        }
    }, []);

    if (isLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (error) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;

    console.log(data);

    return (
        <main className="max-w-6xl mx-auto p-10 border mt-10">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <h2 className="text-xl font-semibold pt-5">Approve the listing</h2>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                {data?.length > 0 ? (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 ">
                                    Item Image
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Posted By
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <DashboardItem item={item} key={item._id} refetch={refetch} />
                            ))}
                            {/* <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="px-6 py-4 text-lg font-bold">Total</td>
                                    <td className="px-6 py-4">{total}</td>
                                    <td className="px-6 py-4">
                                        <button className="bg-blue-600 text-white font-bold rounded-full px-5 py-2" onClick={() => handleCheckOut(total)}>
                                            Checkout
                                        </button>
                                    </td>
                                </tr> */}
                        </tbody>
                    </table>
                ) : (
                    <h2 className="text-center animate-pulse text-blue-700 text-lg my-10">You have nothing to approve</h2>
                )}
            </div>
        </main>
    );
};

export default Dashboard;
