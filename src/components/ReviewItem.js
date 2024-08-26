import {formatTimeStamp} from "../utils/formatTimeStamp"


const ReviewItem = ({ review }) => {

    const maxStars = 5;
    const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 w-2/5">
                            FEEBACK
                        </th>
                        <th scope="col" className="px-6 py-3 w-1/5">
                            FROM
                        </th>
                        <th scope="col" className="px-6 py-3 w-1/5">
                            Ratings
                        </th>
                        <th scope="col" className="px-6 py-3 w-1/5">
                            When
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="odd:bg-white  even:bg-gray-50 ">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                            {review.content}
                        </th>
                        <td className="px-6 py-4">{review.user.fullname}</td>
                        <td className="px-6 py-4">
                            <div className="flex">
                                {stars.map((star) => (
                                    <svg
                                        key={star}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={star <= review.rating ? "currentColor" : "none"}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className={`w-6 h-6 ${star <= review.rating ? "text-yellow-500" : "text-gray-300"}`}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4">{formatTimeStamp(review.date_created)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ReviewItem;
