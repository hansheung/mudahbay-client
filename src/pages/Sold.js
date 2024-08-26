import { useQuery } from "@tanstack/react-query";
import { getSold } from "../api/orders";
import SoldItem from "../components/SoldItem"

const Sold = () => {
    const {
        data: sold,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["sold"],
        queryFn: getSold,
    });

    if (isLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (error) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;

    return (
        <>
            <main className="max-w-6xl mx-auto p-10 border mt-10">
                <h1 className="text-4xl font-bold">SOLD ITEMS</h1>
                <h2 className="text-xl font-semibold pt-5">Items that you have successfully sold in the Marketplace</h2>

                <div className=" sm:rounded-lg mt-10">
                    {sold.length > 0 ? (
                        sold.map((sold) => <SoldItem sold={sold} key={sold._id} />)
                    ) : (
                        <h2 className="text-center animate-pulse text-blue-700 text-lg my-10">Your didnt sold anything</h2>
                    )}
                </div>
            </main>
        </>
    );
};

export default Sold;