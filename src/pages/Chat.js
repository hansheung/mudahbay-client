import Sidebar from "../components/sidebar/Sidebar";
import MessageContainer from "../components/messages/MessageContainer";

const Chat = ({token}) => {
    return (
        <main className="max-w-6xl mx-auto p-10 border mt-10">
            <div className="flex sm:h-96 md:h-128 rounded-lg overflow-hidden bg-gray-100">
                <Sidebar token={token}/>
                <MessageContainer token={token} />
            </div>
        </main>
    );
};

export default Chat;