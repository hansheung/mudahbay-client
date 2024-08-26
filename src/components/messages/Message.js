import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/users";

const Message = ({ message }) => {
    const token = Cookies.get("authToken");
    let userId = null;
    try {
        userId = token ? jwtDecode(token)?.data._id : null;
    } catch (error) {
        console.error("Invalid token:", error);
    }

    const senderId = message.senderId;
    const { data: user, error } = useQuery({
        queryKey: ["user", senderId],
        queryFn: getUser,
        enabled: !!senderId, 
    });

    if (error) {
        console.error("Error fetching user data:", error);
    }

    const profilePic = user?.image || "default-profile.png";

    const fromMe = message.senderId === userId;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const bubbleBgColor = fromMe ? "bg-blue-500" : "";

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={`${process.env.REACT_APP_API_URL}/user/${profilePic}`} />
                </div>
            </div>
            <div className="chat-header flex gap-3 items-center">{user?.fullname}</div>            
            <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>{message.message}</div>
            <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
        </div>
    );
};

export default Message;
