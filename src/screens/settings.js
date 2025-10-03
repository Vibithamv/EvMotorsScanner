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

export default function SettingsScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [visibleTerms, setVisibleTerms] = useState(false);

  const [visiblePrivacyPolicy, setVisiblePrivacyPolicy] = useState(false);

  const deleteProfile = userDeletion();
  const user = userProfile();

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
    Alert.alert(
      "Delete Profile",
      "Do you want to request for profile deletion?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            deleteApi();
          },
        },
      ]
    );
  };

  const deleteApi = async () => {
    try {
      const deleteResult = await deleteProfile.userDeletionApi();

      if (deleteResult.success) {
        Alert.alert(
          "Success",
          "Your request for delete profile is successfully submitted."
        );
      } else {
        Alert.alert(
          "Error",
          deleteResult.error || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
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
    console.log("....", ".....");
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AuthService.logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }], // the only screen left in stack
            })
          );
        },
      },
    ]);
  };

  return visibleTerms ? (
    <WebViewModal
      onDismiss={() => setVisibleTerms(false)}
      url="https://www.evmotors.com"
    />
  ) : visiblePrivacyPolicy ? (
    <WebViewModal
      onDismiss={() => setVisiblePrivacyPolicy(false)}
      url="https://www.evmotors.com"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 50, // makes it a circle
    backgroundColor: "#3E528C", // fill color
    borderWidth: 2,
    top: 110, // thickness of border
    borderColor: "#485781", // border color
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
