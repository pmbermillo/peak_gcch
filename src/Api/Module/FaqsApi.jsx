import axiosInstance from "../../utils/axiosConfig";

export const PostFaqs = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/add-faq",
            data,
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while adding FAQs: ", error);
        throw error;
    }
}

export const GetFaqs = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/gcch/get-faqs",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching FAQs: ", error);
        throw error;
    }
}

export const DeleteFaq = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/delete-faq/",
            id,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            }
        );
    } catch (error) {
        console.error("Error while deleting report: ", error);
        throw error;
    }
}