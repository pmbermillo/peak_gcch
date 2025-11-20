import axiosInstance from "../../utils/axiosConfig";

export const LoginAPI = async (credentials) => {
    try {
        return await axiosInstance.post("gcch/login", credentials);
    } catch (error) {
        console.error("Error while logging in: ", error);
        throw error;
    }
}

export const LogoutAPI = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.error("No token found for logout.");
        return;
    }
    
    try {
        return await axiosInstance.post(
            "gcch/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while logging out: ", error);
        throw error;
    }
}

export const GetMyProfile = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "gcch/me",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while getting my profile: ", error);
        throw error;
    }
}