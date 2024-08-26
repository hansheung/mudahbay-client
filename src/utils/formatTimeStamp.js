

export const formatTimeStamp = (timestamp) => {

    const date = new Date(timestamp);

    // Options for toLocaleString to get the desired format in Malaysia's time zone
    const options = {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kuala_Lumpur",
    };

    const formattedDate = date.toLocaleString("en-US", options);

    // Format the output to remove commas
    return formattedDate.replace(",", "");
};




