import axiosInstance from "../../utils/axiosConfig";

export const GetAttritionData = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/get-attrition-data",
            data,
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching attrition: ", error);
        throw error;
    }
}

export const GetAttritionClient = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/get-attrition-data-client",
            data,
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching attrition: ", error);
        throw error;
    }
}

export const GetManagers = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/get-managers",
            data,
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching client account: ", error);
        throw error;
    }
}

export const PostNotification = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/post-notification",
            data,
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while posting notification: ", error);
        throw error;
    }
}

export const GetNotifications = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/gcch/get-notifications",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching notifications: ", error);
        throw error;
    }
}