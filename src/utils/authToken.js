import Cookies from "js-cookie";

export const saveToken = (newToken) => {
    console.log(newToken);
    Cookies.set("authToken", newToken, { expires: 1 });
    // setToken(newToken);
};

export const clearToken = () => {
    Cookies.remove("authToken");
    Cookies.remove("isAdmin");
};

export const isAdmin = () => {
    // console.log(typeof Cookies.get("isAdmin"));
    // return Cookies.get("isAdmin");
    if (Cookies.get("isAdmin") === "true") {
        return true;
    } else {
        return false;
    }
};

export const isAuth = () => { 
    return Cookies.get("authToken") ? true : false;
}
