import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProductsByUserId } from "../api/products";
import SellingItem from "../components/SellingItem";
import { jwtDecode } from "jwt-decode";

const Selling = ({token}) => {
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["products", jwtDecode(token).data._id],
        queryFn: getProductsByUserId,
    });

    if (isLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (error) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;

    console.log(data);

    return (
        <main className="max-w-6xl mx-auto p-10 border mt-10">
            <h1 className="text-4xl font-bold">Selling</h1>
            <h2 className="text-xl font-semibold pt-5">Items that has been approved to be sold in the Marketplace</h2>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                {data?.length > 0 ? (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
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
                                    Approved
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <SellingItem item={item} key={item._id} refetch={refetch} />
                            ))}
                           
                        </tbody>
                    </table>
                ) : (
                    <h2 className="text-center animate-pulse text-blue-700 text-lg my-10">You are not selling anything or admin hasn't approve your listing</h2>
                )}
            </div>
        </main>
    );
};

export default Selling;
