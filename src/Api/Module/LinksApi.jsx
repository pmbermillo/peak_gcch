import axiosInstance from "../../utils/axiosConfig";

export const AddLinkAPI = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/add-link",
            data,
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
                'Content-Type': 'multipart/form-data'
              },
            }
          );
    } catch (error) {
        console.error("Error while adding link: ", error);
        throw error;
    }
}

export const GetLinksAPI = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/get-links",
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            }
        );
    } catch (error) {
        console.error("Error while fetching links: ", error);
        throw error;
    }
}

export const DeleteLinkAPI = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/delete-link",
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
