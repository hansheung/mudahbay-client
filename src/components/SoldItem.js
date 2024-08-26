import { useState, useEffect } from "react";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import { formatCurrency } from "../utils/formatCurrency";
import { addSoldReview, fetchAvgRating } from "../api/reviews";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const SoldItem = ({ sold  }) => {
    const [avgRatings, setAvgRatings] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [boughtById, setBoughtById ]= useState("");
    const [soldId, setSoldId] = useState("");
    const [productId, setProductId] = useState("");
    const { mutate: reviewSoldMutate } = useMutation({ mutationFn: addSoldReview });
    const [hasReviewed, setHasReviewed] = useState(false);

    const { data } = useQuery({ queryKey: ["review", sold.user._id], queryFn: fetchAvgRating });

    const handleOpenModal = (boughtById, soldId, productId) => {
        setBoughtById(boughtById)
        setSoldId(soldId)
        setProductId(productId)
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    
    useEffect(() => {
        const checkReviewStatus = async () => {
            try {
                const token = Cookies.get("authToken");
                // Check review status for each item
                const statuses = await Promise.all(
                    sold.items.map(async (item) => {
                        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/check-review`, {
                            params: {
                                orderId: sold._id,
                                productId: item.product._id,
                            },
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        
                                                
                        //  console.log(data) 
                        return {
                            soldId: sold._id,
                            productId: item.product._id,
                            hasReviewed: data.hasReviewed, // Assuming the response includes a boolean field
                        };
                    })
                );
                
                // console.log(statuses)
                // Convert array to object for easy access
                const statusObject = statuses.reduce((acc, status) => {
                    acc[`${status.soldId}_${status.productId}`] = status.hasReviewed;
                    return acc;
                }, {});
    
                setHasReviewed(statusObject);
            } catch (error) {
                console.error("Error message:", error);
            }
        };
    
        checkReviewStatus();
    }, [sold._id]);

    const handleSubmitReview = (boughtById, soldId, productId) => {
        // const reviewKey = `${soldId}_${productId}`;
        // console.log("Review submitted:", { boughtById, productId, soldId, content, rating });
        // return
        reviewSoldMutate(
            { boughtById, productId, soldId, content, rating },
            {
                onSuccess: (data) => {
                    alert(data.msg);
                    setHasReviewed((prev) => ({
                        ...prev,
                        [`${soldId}_${productId}`]: true
                    }));
                    handleCloseModal();
                    window.location.reload();
                },
                onError: (error) => alert(error.response.data.msg),
            }
        );
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const handleRatingChange = (e) => setRating(e.target.value);

    // const avgRating = 3; // Assuming this is a placeholder for the actual value
    const maxStars = 5;
    const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

    // console.log(order);
    return (
        <>
            {sold.items.map((item) => {
                 const reviewKey = `${sold._id}_${item.product._id}`;
                 const isReviewSubmitted = !!hasReviewed[reviewKey]
                 const boughtById = sold.user._id;
                //  const avgRating = avgRatings[boughtById] || 0;
                 return (
                    <div className="card2 mb-10" key={item._id}>
                        <div className="flex justify-between">
                            <div className="flex items-center justify-center space-x-5">
                                <p>Bought By: {sold.user.fullname}</p>
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
                                <p className="text-gray-400 italic">{data?.avg?.toFixed(1) || 0 } out of 5</p>
                                {/* {isReviewSubmitted ? (
                                    <p className="text-gray-400 italic">Reviewed</p>
                                ) : (
                                    <button className="bg-emerald-600 text-white font-bold rounded-full px-6 py-2" onClick={() => handleOpenModal(boughtById, sold._id, item.product._id)}>
                                        Review
                                    </button>
                                )} */}
                            </div>

                            <p>Purchased Date: {formatTimeStamp(sold.purchased_date)}</p>
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
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
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="odd:bg-white  even:bg-gray-50 ">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <img src={`${process.env.REACT_APP_API_URL}/${item.product.image}`} alt={item.product.name} className="w-10" />
                                        </th>
                                        <td className="px-6 py-4">{item.product.name}</td>
                                        <td className="px-6 py-4">{formatCurrency(item.product.price)}</td>
                                        <td className="px-6 py-4">{item.quantity}</td>
                                        <td className="px-6 py-4">{formatCurrency(item.subtotal)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-96">

                                    <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
                                    <p className="text-semibold pb-5 text-gray-500 italics">Bought By: {sold.user.fullname}</p>
                                    <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="4" name="content" placeholder="Write your review here..." onChange={handleChange} />
                                    <select className="mt-4 w-30 p-2 border border-gray-300 rounded-md" value={rating} name="rating" onChange={handleRatingChange} aria-label="Rating Selector">
                                        <option value="" disabled>
                                            Select Rating
                                        </option>
                                        {stars.map((star) => (
                                            <option key={star} value={star}>
                                                {star}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mt-4 flex justify-end">
                                        <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                                            Cancel
                                        </button>
                                        <button onClick={() => handleSubmitReview(boughtById, soldId, productId)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                 );
            // })}
            })}
        </>
    );
};

export default SoldItem;
