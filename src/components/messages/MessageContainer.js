import MessageInput from "./MessageInput";
import Messages from "./Messages";
import useConversation from "../../zustand/useConversation";
import { useEffect } from "react";

const MessageContainer = ({token}) => {
    const {selectedConversation, setSelectedConversation } = useConversation();

    useEffect(()=>{
        return() => setSelectedConversation(null)

    },[setSelectedConversation])

    const NoChatSelected = () => {
        
        return (
            <div className='flex items-center justify-center w-full h-full'>
                <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                    <p>Welcome 👋 To Chat ❄</p>
                    <p>You can chat with the user</p>
                    {/* <TiMessages className='text-3xl md:text-6xl text-center' /> */}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 border flex flex-col">
            {!selectedConversation ? (
                <NoChatSelected />
            ): (
            <>
                {/* Header */}
                <div className="bg-blue-200 px-4 py-2 mb-2 flex space-x-3">
                    <div className="w-12 rounded-sm">
                        <img src={`${process.env.REACT_APP_API_URL}/${selectedConversation.product.image}`} alt="product-image" />
                    </div>
                    <span className="label-text"></span> <span className="text-gray-900 font-bold">{selectedConversation.product.name}</span>
                </div>

                <Messages token={token}/>
                <MessageInput />
            </>

            )}
            
            
        </div>
    );
};

export default MessageContainer;
