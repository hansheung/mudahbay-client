import axios from "axios";
import Cookies from "js-cookie";

export const getReview = async ({ queryKey }) => {
    const [_, id] = queryKey;
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/` + id);
    return res.data;
};

export const addReview = async ({ sellerId, productId, orderId, content, rating }) => {
    const body = {
        sellerId,
        productId,
        orderId,
        content,
        rating,
    };
    const token = Cookies.get("authToken");
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/reviews/`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // console.log (res)
    return res.data;
};

export const addSoldReview = async ({ boughtById, productId, soldId, content, rating }) => {
    const body = {
        boughtById,
        productId,
        soldId,
        content,
        rating,
    };
    const token = Cookies.get("authToken");
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/reviews/sold`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // console.log (res)
    return res.data;
};

export const fetchAvgRating = async ({ queryKey }) => {
    const [_, userId] = queryKey;

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${userId}`);
    return res.data;
};
