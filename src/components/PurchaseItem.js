import { useState, useEffect } from "react";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import { formatCurrency } from "../utils/formatCurrency";
import { addReview } from "../api/reviews";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const PurchaseItem = ({ order }) => {
    const [avgRatings, setAvgRatings] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [sellerId, setSellerId] = useState("");
    const [orderId, setOrderId] = useState("");
    const [productId, setProductId] = useState("");
    // const [submittedReviews, setSubmittedReviews] = useState({});
    const { mutate: reviewMutate } = useMutation({ mutationFn: addReview });
    const [hasReviewed, setHasReviewed] = useState(false);

    const handleOpenModal = (sellerId, orderId, productId) => {
        setSellerId(sellerId)
        setOrderId(orderId)
        setProductId(productId)
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        const fetchAvgRatings = async () => {
            try {
                const token = Cookies.get("authToken");

                // Fetch average rating for each seller in the order
                const ratings = await Promise.all(
                    order.items.map(async (item) => {
                        const sellerId = item.product.user._id;
                        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${sellerId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        return { sellerId, avgRating: data.avg };
                    })
                );

                // Convert array to an object where key is sellerId and value is avgRating
                const ratingsObject = ratings.reduce((acc, rating) => {
                    acc[rating.sellerId] = rating.avgRating;
                    return acc;
                }, {});

                setAvgRatings(ratingsObject);
            } catch (error) {
                console.error("Error fetching average ratings:", error);
            }
        };

        fetchAvgRatings();
    }, [order]);

    
    useEffect(() => {
        const checkReviewStatus = async () => {
            try {
                const token = Cookies.get("authToken");
                // Check review status for each item
                const statuses = await Promise.all(
                    order.items.map(async (item) => {
                        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/check-review`, {
                            params: {
                                orderId: order._id,
                                productId: item.product._id,
                                
                            },
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        
                                                
                        //  console.log(data) 
                        return {
                            orderId: order._id,
                            productId: item.product._id,
                            hasReviewed: data.hasReviewed, // Assuming the response includes a boolean field
                        };
                    })
                );
                
                // console.log(statuses)
                // Convert array to object for easy access
                const statusObject = statuses.reduce((acc, status) => {
                    acc[`${status.orderId}_${status.productId}`] = status.hasReviewed;
                    return acc;
                }, {});
    
                setHasReviewed(statusObject);
            } catch (error) {
                console.error("Error message:", error);
            }
        };
    
        checkReviewStatus();
    }, [order._id]);

    const handleSubmitReview = (sellerId, orderId, productId) => {
        // const reviewKey = `${orderId}_${productId}`;
        // console.log("Review submitted:", { sellerId, productId, orderId, content, rating });
        // return
        reviewMutate(
            { sellerId, productId, orderId, content, rating },
            {
                onSuccess: (data) => {
                    alert(data.msg);
                    setHasReviewed((prev) => ({
                        ...prev,
                        [`${orderId}_${productId}`]: true
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

    // const value = 3; // Assuming this is a placeholder for the actual value
    const maxStars = 5;
    const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

    // console.log(order);
    return (
        <>
            {order.items.map((item) => {
                 const reviewKey = `${order._id}_${item.product._id}`;
                 const isReviewSubmitted = !!hasReviewed[reviewKey]
                 const sellerId = item.product.user._id;
                 const avgRating = avgRatings[sellerId] || 0;
                 return (
                    <div className="card2 mb-10" key={item._id}>
                        <div className="flex justify-between">
                            <div className="flex items-center justify-center space-x-5">
                                <p>Sold by: {item.product.user.fullname}</p>
                                <div className="flex">
                                    {stars.map((star) => (
                                        <svg
                                            key={star}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill={star <= avgRating ? "currentColor" : "none"}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className={`w-6 h-6 ${star <= avgRating ? "text-yellow-500" : "text-gray-300"}`}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-400 italic">{avgRating.toFixed(1)} out of 5</p>
                                {isReviewSubmitted ? (
                                    <p className="text-gray-400 italic">Reviewed</p>
                                ) : (
                                    <button className="bg-emerald-600 text-white font-bold rounded-full px-6 py-2" onClick={() => handleOpenModal(item.product.user._id, order._id, item.product._id)}>
                                        Review
                                    </button>
                                )}
                            </div>

                            <p>Purchased Date: {formatTimeStamp(order.purchased_date)}</p>
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
                                    <p className="text-semibold pb-5 text-gray-500 italics">Seller: {item.product.user.fullname}</p>
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
                                        <button onClick={() => handleSubmitReview(sellerId, orderId, productId)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
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

export default PurchaseItem;
