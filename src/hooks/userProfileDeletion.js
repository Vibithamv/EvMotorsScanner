import NetworkService from "../services/NetworkService";

export const userDeletion = () => {
  const userDeletionApi = async () => {
    try {
      const response = await NetworkService.post("/api/users/delete-request");

      if (response.success) {
        console.log(
          "Delete request success",
          "Your request for delete profile is successfully submitted."
        );
        return { success: true, data: response.data };
      } else {
        console.log(
          "Delete request failed",
          "User registration failed. Please try again."
        );
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.log(
        "Error",
        "An error occurred during profile delete request. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  return {
    userDeletionApi,
  };
};
