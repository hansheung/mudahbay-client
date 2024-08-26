import axios from "axios";
import Cookies from "js-cookie";

//GET CART
export const getCart = async () => {
    const token = Cookies.get("authToken");
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/carts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // console.log(res.data);
    return res.data;
};

//ADD TO CART
export const addToCart = async ({ productId, quantity }) => {
    const token = Cookies.get("authToken");
    const body = {
        productId,
        quantity,
    };
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/carts/`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

//UPDATE TO CART
export const updateCart = async ({ id, quantity }) => {
    const token = Cookies.get("authToken");
    const body = {
        productId: id,
        quantity,
    };
    let res = await axios.put(`${process.env.REACT_APP_API_URL}/carts/`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

//DELETE AN ITEM INSIDE THE CART
export const deleteItem = async ({ id }) => {
    // console.log(id)
    const token = Cookies.get("authToken");
    let res = await axios.delete(`${process.env.REACT_APP_API_URL}/carts/` + id, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // console.log(res);
    //     return;
    return res.data;
};

//EMPTY CART
export const deleteCart = async () => {
    // console.log("1234667")

    const token = Cookies.get("authToken");
    let res = await axios.delete(`${process.env.REACT_APP_API_URL}/carts/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
