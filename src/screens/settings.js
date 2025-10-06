// screens/HomeScreen.tsx
import { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import WebViewModal from "../components/WebViewModel";
import { userProfile } from "../hooks/userProfile";
import { userDeletion } from "../hooks/userProfileDeletion";
import {
  Colors,
  CommonStyles,
  FontConfig,
  Images,
} from "../utils/AssetManager";
import AuthService from "../services/AuthService";
import { CommonActions } from "@react-navigation/native";
import { CustomAlertProvider } from "../components/CustomAlert";

export default function SettingsScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [visibleTerms, setVisibleTerms] = useState(false);
  const [visiblePrivacyPolicy, setVisiblePrivacyPolicy] = useState(false);
  const [logoutAlert, setLogoutAlert] = useState(false);
  const deleteProfile = userDeletion();
  const user = userProfile();
  const [deleteProfileAlert, setdeleteProfileAlert] = useState(false);
    const [deleteResponseAlert, setdeleteResponseAlert] = useState(false);
   const [alertTitle, setalertTitle] = useState("");
    const [alertDescription, setalertDescription] = useState("");

  useEffect(() => {
    console.log("Fetching user profile data...");
    const fetchData = async () => {
      try {
        const result = await user.userProfileApi();
        if (result.success) {
          setUserName(result.data.firstName + " " + result.data.lastName);
        } else {
          setUserName("Guest User");
        }
      } catch (error) {
        setUserName("Guest User");
      }
    };
    fetchData();
  }, []);

  const onDelete = async () => {
    // setIsDeleteRequest(true);
    setdeleteProfileAlert(true);
    // Alert.alert(
    //   "Delete Profile",
    //   "Do you want to request for profile deletion?",
    //   [
    //     {
    //       text: "Cancel",
    //       style: "cancel",
    //     },
    //     {
    //       text: "Delete",
    //       style: "destructive",
    //       onPress: async () => {
    //         deleteApi();
    //       },
    //     },
    //   ]
    // );
  };

  const deleteApi = async () => {
    try {
      const deleteResult = await deleteProfile.userDeletionApi();

      if (deleteResult.success) {
        setdeleteResponseAlert(true)
        setalertTitle("Success")
        setalertDescription("Your request for delete profile is successfully submitted.")
        // Alert.alert(
        //   "Success",
        //   "Your request for delete profile is successfully submitted."
        // );
      } else {
         setdeleteResponseAlert(true)
        setalertTitle("Error")
        setalertDescription( deleteResult.error || "An error occurred. Please try again.")
        // Alert.alert(
        //   "Error",
        //   deleteResult.error || "An error occurred. Please try again."
        // );
      }
    } catch (error) {
        setdeleteResponseAlert(true)
        setalertTitle("Error")
        setalertDescription( "An error occurred. Please try again.")
    }
    // finally {
    //   setIsDeleteRequest(false);
    // }
  };

  const privacyPolicy = () => {
    setVisiblePrivacyPolicy(true);
  };

  const terms = () => {
    setVisibleTerms(true);
  };

  const handleLogout = () => {
    setLogoutAlert(true);
  };

  return visibleTerms ? (
    <WebViewModal
      onDismiss={() => setVisibleTerms(false)}
      url="https://evmotors.com/terms-conditions/"
    />
  ) : visiblePrivacyPolicy ? (
    <WebViewModal
      onDismiss={() => setVisiblePrivacyPolicy(false)}
      url="https://evmotors.com/privacy-policy/"
    />
  ) : (
    <View style={styles.container}>
      <Image
        source={Images.profile}
        style={{ width: 50, height: 50, position: "absolute", top: 50 }}
      />
      <Text style={styles.header1}>{userName}</Text>
      <Text
        style={{
          marginBottom: 50,
          textAlign: "center",
          marginTop: 5,
          position: "absolute",
          top: 130,
          fontSize: FontConfig.sizes.small,
          fontWeight: FontConfig.weights.regular,
          color: Colors.userTypeText,
          fontFamily: FontConfig.families.poppinsRegular,
        }}
      >
        {/* User Type */}
      </Text>
      <Text style={styles.manageAcountStyle}>MANAGE ACCOUNT</Text>
      <View style={styles.profileDeleteStyle}>
        <Text style={styles.profileDeleteTextStyle}>
          Request to profile deletion
        </Text>
        <TouchableOpacity onPress={onDelete}>
          <Image source={Images.delete} style={styles.deleteImage} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: 1, // thickness of the line
          width: "100%", // full width
          backgroundColor: Colors.manageAccountText, // line color
          marginVertical: 10,
        }}
      />

      <View style={styles.profileDeleteStyle}>
        <Text style={styles.profileDeleteTextStyle}>Sign Out</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Image source={Images.signout} style={styles.deleteImage} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 1, // thickness of the line
          width: "100%", // full width
          backgroundColor: Colors.manageAccountText, // line color
          marginVertical: 10,
        }}
      />
      <View style={{ height: 50 }}></View>

      <Text style={styles.manageAcountStyle}>READ POLICIES</Text>

      <Text style={styles.policyTextStyle} onPress={terms}>
        Terms and Conditions
      </Text>

      <View
        style={{
          height: 1, // thickness of the line
          width: "100%", // full width
          backgroundColor: Colors.manageAccountText, // line color
          marginVertical: 10,
        }}
      />

      <Text style={styles.policyTextStyle} onPress={privacyPolicy}>
        Privacy Policy
      </Text>
      <View
        style={{
          height: 1, // thickness of the line
          width: "100%", // full width
          backgroundColor: Colors.manageAccountText, // line color
          marginVertical: 10,
        }}
      />
      {logoutAlert ? 
      <CustomAlertProvider
                title="Logout"
                description={'Are you sure you want to logout?'}
                option2="Cancel"
                handleOption2={() => {
                   setLogoutAlert(false)
                }}
                option1="Logout"
                handleOption1={async () => {
                  setLogoutAlert(false)
                   await AuthService.logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }], // the only screen left in stack
            })
          );
                }}
              /> : null}

               {deleteProfileAlert ? 
      <CustomAlertProvider
                title="Delete Profile"
                description={'Do you want to request for profile deletion?'}
                option2="Cancel"
                handleOption2={() => {
                   setdeleteProfileAlert(false)
                }}
                option1="Delete"
                handleOption1={async () => {
                  setdeleteProfileAlert(false)
                 deleteApi();  }}
              /> : null}

               {deleteResponseAlert ? (
        <CustomAlertProvider
          title={alertTitle}
          description={
           alertDescription
          }
          option1="Ok"
          handleOption1={() => {
            setdeleteResponseAlert(false);
          }}
        />
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   ...CommonStyles.container,
    alignItems: "center",
  },
  button: {
    ...CommonStyles.primaryButton,
    marginTop: 8,
  },
  buttonContent: {
    ...CommonStyles.primaryButtonText,
  },
  header1: {
    ...CommonStyles.settingsHeader1,
    textAlign: "center",
    marginTop: 5,
    position: "absolute",
    top: 100,
  },

  manageAcountStyle: {
    fontSize: FontConfig.sizes.small,
    fontWeight: FontConfig.weights.regular,
    color: Colors.manageAccountText,
    fontFamily: FontConfig.families.poppinsBold,
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  profileDeleteStyle: {
    flexDirection: "row", // horizontal layout
    justifyContent: "space-evenly", // pushes text left, image right
    alignItems: "center",
    borderRadius: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },
  profileDeleteTextStyle: {
    fontSize: 16,
    color: Colors.deleteText,
    flex: 1,
  },
  policyTextStyle: {
    fontSize: 16,
    color: Colors.deleteText,
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 10,
  },
  deleteImage: {
    width: 16,
    height: 16,
    borderRadius: 20, // makes image circular
  },
});
