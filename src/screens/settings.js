// screens/HomeScreen.tsx
import { useEffect, useState } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WebViewModal from "../components/WebViewModel";
import { userProfile } from "../hooks/userProfile";
import { userDeletion } from "../hooks/userProfileDeletion";
import { Colors, CommonStyles } from "../utils/AssetManager";

export default function SettingsScreen({ navigation }) {
  const [isDeleteRequest, setIsDeleteRequest] = useState(false);
  const [isPolicyRequest, setIsPolicyRequest] = useState(false);
  const [isConditionRequest, setIsConditionRequest] = useState(false);
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
    setIsDeleteRequest(true);
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
    } finally {
      setIsDeleteRequest(false);
    }
  };

  const privacyPolicy = () => {
    setVisiblePrivacyPolicy(true);
  };

  const terms = () => {
    setVisibleTerms(true);
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
      <Text style={styles.header1}>{`Welcome\n${userName}`}</Text>

      <TouchableOpacity
        onPress={onDelete}
        style={styles.button}
        disabled={isDeleteRequest}
      >
        <Text style={styles.buttonContent}>
          {isDeleteRequest ? "Loading..." : "Profile Deletion Request"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={terms}
        style={styles.button}
        disabled={isConditionRequest}
      >
        <Text style={styles.buttonContent}>
          {isConditionRequest ? "Loading..." : "Terms and Conditions"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={privacyPolicy}
        style={styles.button}
        disabled={isPolicyRequest}
      >
        <Text style={styles.buttonContent}>
          {isPolicyRequest ? "Loading..." : "Privacy policy"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },
  button: {
    ...CommonStyles.primaryButton,
    marginTop: 8,
  },
  buttonContent: {
    ...CommonStyles.primaryButtonText,
  },
  header1: {
    ...CommonStyles.header1,
    position: "absolute",
    top: 126,
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "InstrumentSans-Bold",
  },
});
