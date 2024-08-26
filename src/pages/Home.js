import { HiOutlineSearch} from "react-icons/hi";
import { getProducts } from "../api/products";
import { useQuery } from "@tanstack/react-query";
import ProductItem from "../components/ProductItem";
import { debounce } from "lodash";
import { useState, useRef } from "react";



const Home = ({token}) => {
    const [searchValue, setSearchValue] = useState("")
    const inputRef = useRef(null);
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["products", searchValue],
        queryFn: getProducts,
    });

    if (isLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (error) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;
    
    // let debounceSetName = debounce((value) => setSearchValue(value), 1000);
    const handleSearchClick = () => {
        setSearchValue(inputRef.current.value); 
        refetch(); 
    };

    return (
        <div className="max-w-6xl mx-auto mt-2">
            <div className="flex justify-center items-center space-x-2 py-5 mx-10">
                {/* <div className="h-15 w-20 sm:w-28 md:w-40 shrink-0">
                    <img src="/logowithword.png" className="h-full w-full object-contain" />
                </div> */}
                {/* <button className="hidden lg:flex items-center w-20 space-x-2">
                    <p className="text-grey-600 text-sm">Shop by Category</p>
                    <HiChevronDown className="h-4 shrink-0 mt-2" />
                </button> */}

                
                <div className="flex items-center border-black border-2 space-x-2 px-3 md:px-5 py-1 flex-1 rounded-md">
                    <HiOutlineSearch className="text-2xl text-gray-400" />
                    <input type="text" placeholder="Search for anything" className="flex-1 border-transparent focus:border-transparent focus:ring-0"  ref={inputRef}/>
                </div>
                <button className=" sm:inline bg-blue-600 text-white px-5 md:px-10 py-2 border-2 border-blue-600 rounded-md" onClick={handleSearchClick}>Search</button>
            </div>
            <hr></hr>
            <div>
                {isLoading ? (
                    <h1 className="text-center animate-pulse text-blue-500">Loading....</h1>
                ) : (
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
                        {data.map((product) => (
                            <ProductItem product={product} key={product._id} token={token} />
                        ))}
                    </div>      
                )}
            </div>
        </div>

    );
};

export default Home;
