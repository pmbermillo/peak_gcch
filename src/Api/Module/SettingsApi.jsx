import axiosInstance from "../../utils/axiosConfig";

export const GetUser = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/gcch/get-user",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while creating module: ", error);
        throw error;
    }
}

export const PostUser = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/post-user",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while creating module: ", error);
        throw error;
    }
}

export const DeleteUser = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/gcch/delete-user",
            id, 
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while deleting user: ", error);
        throw error;
    } 
}