import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);

        // console.log(selectedConversation.product._id)
        // console.log(message)
        const token = Cookies.get("authToken");

		try {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/messages/send/${selectedConversation.product.user._id}/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
                    "Authorization" : `Bearer ${token}`,
				},
				body: JSON.stringify({ product: selectedConversation.product._id,  message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;