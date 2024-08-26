import { Routes, Route } from "react-router-dom";
import TopNav from "./components/Navbar";
import { useState } from "react";
import Cookies from "js-cookie";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Sold from "./pages/Sold";
import Purchase from "./pages/Purchase";
import Dashboard from "./pages/Dashboard";
import Review from "./pages/Review";
import Selling from "./pages/Selling";
import User from "./pages/User";
import Chat from "./pages/Chat";

function App() {
    const [token, setToken] = useState(Cookies.get("authToken") || "");
    return (
        <>
            <TopNav data={{ token, setToken }} />

            <Routes>
                {/* <Route path="/" /> */}
                <Route path="/" element={<Home token={token} />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product" element={<Product token={token} />} />
                <Route path="/productdetail/:id" element={<ProductDetail token={token} />} />
                <Route path="/carts" element={<Cart />} />
                <Route path="/orders" element={<Purchase />} />
                <Route path="/orders/sold" element={<Sold />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reviews/:id" element={<Review />} />
                <Route path="/selling" element={<Selling token={token} />} />
                <Route path="/user/:id" element={<User />} />
                <Route exact path="/chat" element={<Chat token={token} />} />
            </Routes>
        </>
    );
}

export default App;
