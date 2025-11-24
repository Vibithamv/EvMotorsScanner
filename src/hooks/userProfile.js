import NetworkService from "../services/NetworkService";

export const userProfile = () => {
  const userProfileApi = async () => {
    try {
      const response = await NetworkService.get("/api/users/me");

      if (response.success) {
        console.log("User profile request success", response.data);
        return { success: true, data: response.data };
      } else {
        console.log(
          "User profile request failed",
          "User profile fetch failed. Please try again."
        );
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.log(
        "Error",
        "An error occurred during user profile fetch. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  return {
    userProfileApi,
  };
};
