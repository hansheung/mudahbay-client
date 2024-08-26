import useConversation from "../../zustand/useConversation"

const Conversation = ({conversation}) => {

    const{selectedConversation, setSelectedConversation} = useConversation();

    const isSelected = selectedConversation?._id === conversation._id;

    return (
        <>
            <div 
            className={`flex gap-2 items-center hover:bg-sky-300 rounded p-2 py-1 cursor-pointer border mx-3
                ${isSelected ? "bg-sky-300" : ""}`                
            }
            onClick = {() => setSelectedConversation(conversation)}
            >

                <div className="avatar">
                    <div className="w-12 rounded-sm">
                        <img src={`${process.env.REACT_APP_API_URL}/${conversation.product.image}`} alt="product-image" />
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex gap-2 flex-col">
                        <p className="font-bold text-xs text-gray-400 italic">Sold by: {conversation.product.user.fullname}</p>
                        
                        <p className="font-bold text-gray-400">{conversation.product.name}</p>

                    </div>
                </div>
            </div>

            <hr className="my-3"></hr>
        </>
    );
};

export default Conversation;
