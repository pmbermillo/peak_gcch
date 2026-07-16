import axiosInstance from "../../utils/axiosConfig";

export const GetMembersAPI = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/gcch/members",
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching members: ", error);
        throw error;
    }
}

export const UpdateMemberAPI = async (id, data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            `/gcch/member/${id}`,
            data,
            { 
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching members: ", error);
        throw error;
    }
}

export const AddMemberAPI = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/gcch/member",
            data,
            { 
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching members: ", error);
        throw error;
    }
}

export const DeleteMemberAPI = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.delete(
            `/gcch/member/${id}`,
            { 
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching members: ", error);
        throw error;
    }
}

// export const GetMemberAPI = async (data) => {
//     const token = localStorage.getItem('auth_token');
//     try {
//         return await axiosInstance.post(
//             "/gcch/employees",
//             data,
//             { 
//               headers: {
//                 Authorization: `Bearer ${token}`, // Send token in the Authorization header
//               },
//             }
//           );
//     } catch (error) {
//         console.error("Error while fetching attrition: ", error);
//         throw error;
//     }
// }