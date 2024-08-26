// REGISTER
import axios from "axios";

export const registerUser = async (user) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, user);
    return { data: res.data, status: res.status };
};

// LOGIN
export const login = async (user) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, user);
    return { data: res.data, status: res.status };
};

export const getUser = async ({ queryKey }) => {
    const [_, userId] = queryKey;
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`);
    return res.data.user;
};

//UPDATE PRODUCT
export const updateUser = async ({id, formData: {fullname, email, password, image}}) => {
    // console.log(id);
    // console.log(image);
    
    // return;
    // const token = Cookies.get("authToken");
    const formData = new FormData();
    // console.log(product);    
    formData.append("fullname", fullname);
    formData.append("email",email);
    formData.append("password", password);
    if (image) {
        formData.append("image", image);
    }

    let res = await axios.put(`${process.env.REACT_APP_API_URL}/users/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${token}`,
        },
    });

    return { data: res.data, status: res.status };
};