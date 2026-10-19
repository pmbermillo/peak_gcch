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

export const GetAllNotifications = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/gcch/get-all-notifications",
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

export const DeleteNotification = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/delete-notification",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while deleting notification: ", error);
        throw error;
    }
}

export const submitSuggestion = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/submit-suggestion",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    }
    catch (error) {
        console.error("Error while submitting suggestion: ", error);
        throw error;
    }
}

export const GetSuggestions = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/gcch/get-suggestions",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    }
    catch (error) {
        console.error("Error while fetching suggestions: ", error);
        throw error;
    }
}

export const UpdateSuggestion = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/update-suggestion",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    }
    catch (error) {
        console.error("Error while updating suggestion: ", error);
        throw error;
    }
}