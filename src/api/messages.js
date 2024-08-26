import axios from "axios";

export const getSideBar = async ({ queryKey }) => {
    const [_, userId] = queryKey;
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/messages/conversation/${userId}`);
    return res.data;
};