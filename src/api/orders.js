import axios from "axios";
import Cookies from "js-cookie";


export const getOrders = async () => {
    const token = Cookies.get("authToken");
  
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // console.log(res)
    return res.data;
};

export const getSold = async () => {
    const token = Cookies.get("authToken");
  
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/sold`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // console.log(res)
    return res.data;
};

export const checkout = async ({ total }) => {
    const token = Cookies.get("authToken");
    const body = {
        total
    };
 console.log("1234")
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/orders/`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
 console.log(res)
    return res.data;
};