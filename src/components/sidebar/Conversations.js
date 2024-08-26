import Conversation from "./Conversation";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import { getSideBar } from "../../api/messages";

const Conversations = ({ token }) => {
    const userId = token ? jwtDecode(token)?.data._id : null;

    const { data, isLoading, error } = useQuery({ queryKey: ["product", userId], queryFn: getSideBar });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error occurred: {error.message}</p>;

    return (
        <>
            <div className="flex flex-col overflow-auto">
                {data && data.length > 0 ? (
                        data.map((conversation) => (
                            <Conversation key={conversation._id} conversation={conversation} />
                        ))
                    ) : (
                        <h2 className="p-5">You have no product</h2>
                    )}
            </div>
        </>
    );
};

export default Conversations;
