import Conversations from "./Conversations";

const Sidebar = ({token}) => {
    return (
        <div className=" border flex flex-col">
            <>
                <div className="bg-blue-200 px-4 py-2 mb-2 h-24">
                    <span className="text-2xl">Chat</span>
                </div>

                <Conversations token={token} />
            </>
        </div>
    );
};

export default Sidebar;
