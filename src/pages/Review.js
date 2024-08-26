import { fetchAvgRating } from "../api/reviews";
import { useQuery } from "@tanstack/react-query";
import ReviewItem from "../components/ReviewItem"
import { useParams } from "react-router-dom";
import { getUser } from "../api/users";
import { formatTimeStamp } from "../utils/formatTimeStamp";

const Review = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery({ queryKey: ["review", id], queryFn: fetchAvgRating });
    const { data: user, isLoading: isUserLoading, error: errorUser } = useQuery({ queryKey: ["user", id], queryFn: getUser });
    
    if (isLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (error) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;

    if (isUserLoading) return <h2 className="text-center animate-pulse text-blue-700 text-lg mt-10">Loading...</h2>;
    if (errorUser) return <h2 className="text-center animate-pulse text-red-700 text-lg mt-10">Error Loading Page...</h2>;


    const maxStars = 5;
    const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

    return (
        <>
            <main className="max-w-6xl mx-auto p-10 border mt-10">
                <div className="border p-10 m-5">
                <div className="md:flex md:space-x-2 md:items-center">
                    <h1 className="text-4xl font-bold">{user.fullname}</h1>
                    <div className="flex mt-3">
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
                    <p className="text-gray-400 italic mt-3">{data?.avg?.toFixed(1) || 0 } out of 5</p>
                
                </div>
                <h2 className="text-xl font-semibold pt-5">Date Joined: {formatTimeStamp(user.date_created)}</h2>
                </div>
                <div className=" sm:rounded-lg mt-10">
                    {data.reviews.length > 0 ? data.reviews.map((review) => <ReviewItem review={review} key={review._id} />) : 
                    <h2 className="text-center animate-pulse text-blue-700 text-lg my-10">Your don't have any review</h2>}
                </div>
                
            </main>
        </>
    );
};
export default Review;
