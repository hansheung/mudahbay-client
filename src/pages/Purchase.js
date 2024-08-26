import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders";
import PurchaseItem from "../components/PurchaseItem";

const Purchase = () => {
    const {
        data: orders,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["purchase"],
        queryFn: getOrders,
    });

    if (isLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (error) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;

    return (
        <>
            <main className="max-w-6xl mx-auto p-10 border mt-10">
                <h1 className="text-4xl font-bold">PURCHASED ITEMS</h1>
                <h2 className="text-xl font-semibold pt-5">What you have bought in the Marketplace</h2>

                <div className=" sm:rounded-lg mt-10">
                    {orders.length > 0 ? (
                        orders.map((order, i) => <PurchaseItem order={order} key={order._id} />)
                    ) : (
                        <h2 className="text-center animate-pulse text-blue-700 text-lg my-10">Your didnt purchase anything</h2>
                    )}
                </div>
            </main>
        </>
    );
};

export default Purchase;
