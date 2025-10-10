import NetworkService from "../services/NetworkService";

export const userRegister = (firstName, lastName, phoneNo, email) => {
  const userRegisterApi = async () => {
    const userID = await NetworkService.getStoredData("userID");
    try {
      const response = await NetworkService.post("/api/users/register", {
        cognito_user_id: userID,
        firstname: firstName,
        lastname: lastName,
        email: email,
        contact_phone_no: phoneNo,
      });

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.log(
        "Error",
        "An error occurred during registration. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  return {
    userRegisterApi,
  };
};
