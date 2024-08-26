import { Link } from "react-router-dom";
import { redirect } from "react-router-dom";
import { clearToken, isAdmin, isAuth } from "../utils/authToken";
import { HiOutlineShoppingCart, HiOutlineChat, HiOutlineUserCircle, HiChevronDown } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import { fetchAvgRating } from "../api/reviews";
import { getUser } from "../api/users";

const TopNav = ({ data: { token, setToken } }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownUserOpen, setIsDropdownUserOpen] = useState(false);
    const timeoutRef = useRef(null);
    // console.log(isDropdownUserOpen);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsDropdownOpen(true);
    };

    const handleMouseEnterUser = () => {
        clearTimeout(timeoutRef.current);
        setIsDropdownUserOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200); // Adjust the delay as needed
    };

    const handleMouseLeaveUser = () => {
        // console.log("on leave: ", timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsDropdownUserOpen(false);
        }, 200); // Adjust the delay as needed
    };

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current); // Clear the timeout on unmount
        };
    }, []);
    const userId = token ? jwtDecode(token)?.data._id : null;

    const { data, isLoading, error } = useQuery({ queryKey: ["review", token ? jwtDecode(token).data._id : null], queryFn: fetchAvgRating });
    // if (isLoading) return <h2>Loading...</h2>;
    // if (error) return <h2>Error...</h2>;
    const { data: user } = useQuery({ queryKey: ["user", userId], queryFn: getUser });

    const logoutHandler = () => {
        clearToken();
        setToken(null);
        setIsDropdownUserOpen(false);
        return redirect("/");
    };

    return (
        <div className="max-w-6xl mx-auto">
            <nav className="flex justify-between m-2">
                <div className="flex items-center space-x-4 text-sm">
                    <div className="relative">
                        {isAuth() ? (
                            <div className="flex items-center space-x-1 cursor-pointer">
                                <Link to="/">
                                    <img src="/mudahbaylogocropped.png" className="w-10 me-5" alt="mudahlogo" />
                                </Link>
                                <p>Hi, </p>
                                <div className="flex items-center space-x-1 cursor-pointer" onMouseEnter={handleMouseEnterUser} onMouseLeave={handleMouseLeaveUser}>
                                    <p className="text-blue-500">{user?.fullname}</p>
                                    <HiChevronDown className="w-5 h-5 mt-1" />
                                    {isDropdownUserOpen && (
                                        <div className="absolute top-full right-70 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                                            <div className="flex items-center mb-4">
                                                {user?.image ? (
                                                    <img className="border h-12 w-12 object-contain rounded-full" src={`${process.env.REACT_APP_API_URL}/user/${user.image}`} alt="User Profile" />
                                                ) : (
                                                    <HiOutlineUserCircle className="h-12 w-12 text-gray-500" />
                                                )}
                                                <div className="ml-3">
                                                    {/* <p className="font-bold">Cheah Hansheung</p> */}
                                                    <p className="font-bold">{user?.fullname}</p>
                                                    <Link to={`/reviews/${userId}`} className="text-blue-500 text-sm">
                                                        ({data?.avg?.toFixed(1) || 0} out of 5 ★)
                                                    </Link>
                                                </div>
                                            </div>
                                            <ul>
                                                <Link to={`/user/${userId}`}>
                                                    <li className="py-1 cursor-pointer hover:bg-gray-100 rounded">Account settings</li>
                                                </Link>
                                                <li className="py-1 cursor-pointer hover:bg-gray-100 rounded">
                                                    <Link to="/" onClick={logoutHandler}>
                                                        Sign out
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-1">
                                <Link to="/">
                                    <img src="/mudahbaylogocropped.png" className="w-10 me-5" alt="mudahlogo" />
                                </Link>
                                <p>
                                    Hi,
                                    <Link to="/login" className="text-blue-500 cursor-pointer ps-1">
                                        (Login)
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                    {/* <p className="hidden md:inline-flex cursor-pointer">Help & Contact</p> */}
                </div>
                <div className="flex items-center space-x-5 text-sm">
                    {isAuth() ? <Link to="/product">Sell</Link> : <Link to="/login">Sell</Link>}

                    {isAuth() ? (
                        <div className="relative" onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
                            <div className="flex items-center space-x-2">
                                <p className="cursor-pointer">My Account</p>
                                <HiChevronDown className="w-5 h-5 mt-1" />
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10" style={{ left: "-100%" }}>
                                    <ul>
                                        <Link to="/selling">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Selling</li>
                                        </Link>
                                        <Link to="/orders/sold">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sold</li>
                                        </Link>
                                        <Link to="/orders">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Purchase History</li>
                                        </Link>
                                        {isAdmin() && (
                                            <Link to="/dashboard">
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Dashboard</li>
                                            </Link>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">My Account</Link>
                    )}
                    {isAuth() ? (
                        <Link to="/carts">
                            <HiOutlineShoppingCart className="h-5 w-5" />
                        </Link>
                    ) : (
                        <Link to="/login">
                            <HiOutlineShoppingCart className="h-5 w-5" />
                        </Link>
                    )}
                    {isAuth() ? (
                        <Link to="/chat">
                            <HiOutlineChat className="h-5 w-5" />
                        </Link>
                    ) : (
                        <Link to="/login">
                            <HiOutlineChat className="h-5 w-5" />
                        </Link>
                    )}
                </div>
            </nav>

            <hr></hr>
        </div>
    );
};

export default TopNav;
