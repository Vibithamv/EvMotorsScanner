import NetworkService from "../services/NetworkService";

export const userRegister = (firstName, lastName, phoneNo, email) => {
  const userRegisterApi = async () => {
    const userID = await NetworkService.getStoredData("userID");
    try {
      const response = await NetworkService.post("/api/users/register", {
        cognito_user_id: userID,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_no: phoneNo,
      });

      if (response.success) {
        console.log(
          "Registration completed",
          "Your account has been registered successfully."
        );
        return { success: true, data: response.data };
      } else {
        console.log("Failed", "User registration failed. Please try again.");
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
