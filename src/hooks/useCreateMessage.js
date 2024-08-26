import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const useCreateMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const createMessage = async (productUserId, productId) => {
		setLoading(true);
        // console.log(productUserId)
		// console.log(productId)

		// return
        const token = Cookies.get("authToken");

		try {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/messages/create/${productUserId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
                    "Authorization" : `Bearer ${token}`,
				},
				body: JSON.stringify({ product: productId, }),
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

	return { createMessage, loading };
};
export default useCreateMessage;