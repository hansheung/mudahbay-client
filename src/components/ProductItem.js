import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { fetchAvgRating } from "../api/reviews";
import { useQuery } from "@tanstack/react-query";

const ProductItem = ({ product, token }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const maxLength = 70;

    const { data } = useQuery({ queryKey: ["review", product?.user?._id], queryFn: fetchAvgRating });

    let loginId;
    try {
        loginId = jwtDecode(token).data._id;
    } catch (error) {
        console.error("Invalid token", error);
        loginId = null;
    }

    const productUserId = product?.user?._id;

    const MyPost = () => loginId === productUserId;

    const value = 3;
    const maxStars = 5;
    const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

    return (
        <div className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out">
            <Link to={`/productdetail/${product._id}`}>
                <div className="flex flex-col items-center pb-2 mb-3" style={{ height: "190px" }}>
                    <img className="w-44 object-cover" src={`${process.env.REACT_APP_API_URL}/${product.image}`} alt={product.image} />
                </div>
            </Link>
            <div className="flex flex-col pb-4 space-y-4">
                <div>
                    <h1 className="text-lg font-bold mb-3">{product.name}</h1>
                    <hr></hr>
                    <p className="mt-3 break-words">{isExpanded || product.description.length <= maxLength ? product.description : `${product.description.slice(0, maxLength)}...`}</p>
                    {product.description.length > maxLength && (
                        <button onClick={toggleDescription} className="text-blue-500 hover:underline mt-2">
                            {isExpanded ? "See Less" : "See More"}
                        </button>
                    )}

                    <hr className="mt-5"></hr>

                    <h1 className="text-lg font-bold mt-5 mb-5">RM {product.price}</h1>
                    <Link to={`/reviews/${productUserId}`}>
                        <div className="flex items-center justify-start space-x-5">
                            <p>{product.user.fullname}</p>

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
                        </div>
                    </Link>

                    {/* <p className="text-gray-400 italic">4.5 out of 5</p> */}
                </div>
            </div>

            {MyPost() ? (
                <button className="bg-green-600 text-white font-bold rounded-full px-5 py-3 ml-auto" onClick={() => navigate(`/productdetail/${product._id}`)}>
                    Edit listing
                </button>
            ) : loginId === null ? (
                <div></div>
            ) : (
                <button className="bg-blue-600 text-white font-bold rounded-full px-5 py-3 ml-auto" onClick={() => navigate(`/productdetail/${product._id}`)}>
                    Add to Cart
                </button>
            )}
        </div>
    );
};

export default ProductItem;
