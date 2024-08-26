import axios from "axios";
import Cookies from "js-cookie";
//GET ALL PRODUCTS
export const getProducts = async ({queryKey}) => {

    const [key, searchValue ] = queryKey;
    
    // console.log("This is the clientAPI searchValue:", searchValue)
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/products/?search=${searchValue}`);
    //  console.log("Return to client", res)
    return res.data.products;
};

export const getProductsAdmin = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/products/admin`);
    return res.data.products;
};

//GET PRODUCT BY ID
export const getProductById = async ({ queryKey }) => {
    const [_, id] = queryKey;
    // console.log("ID" , id)

    let res = await axios.get(`${process.env.REACT_APP_API_URL}/products/` + id);

    // console.log(res.data)
    return res.data.product;
};

//GET PRODUCT LISTED BY USER ID
export const getProductsByUserId = async ({ queryKey }) => {
    const [_, id] = queryKey;
    console.log("ID" , id)

    let res = await axios.get(`${process.env.REACT_APP_API_URL}/products/user/` + id);

    // console.log(res.data)
    return res.data.product;
};

//ADD PRODUCT
export const addProduct = async (product) => {
    const token = Cookies.get("authToken");
    const formData = new FormData();
    // console.log(product);
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("description", product.description);
    formData.append("category", product.category);
    if (product.image) {
        formData.append("image", product.image);
    }

    let res = await axios.post(`${process.env.REACT_APP_API_URL}/products/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });

    return { data: res.data, status: res.status };
};

//DELETE PRODUCT
export const deleteProduct = async (id) => {
    const token = Cookies.get("authToken");
    let res = await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data.product;
};

//UPDATE/APPROVE PRODUCT BY ADMIN
export const approveProduct = async ({productId}) => {
    
    const token = Cookies.get("authToken");
    
    let res = await axios.patch(`${process.env.REACT_APP_API_URL}/products/${productId}`, null,  {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data.product;
};

//UPDATE PRODUCT
export const updateProduct = async ({id, formData: {name, price, quantity, description, category, image}}) => {
    // console.log(id);
    // console.log(image);
    
    // return;
    const token = Cookies.get("authToken");
    const formData = new FormData();
    // console.log(product);    
    formData.append("name", name);
    formData.append("price",price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("category", category);
    if (image) {
        formData.append("image", image);
    }

    let res = await axios.put(`${process.env.REACT_APP_API_URL}/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });

    return { data: res.data, status: res.status };
};
