// CustomAlert.js
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors } from "../utils/AssetManager";


export const CustomAlertProvider = ({ title, description, option1, option2, option3, handleOption1,
    handleOption2, handleOption3
 }) => {
  const [visible, setVisible] = useState(true);

  return (

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{description}</Text>

            <TouchableOpacity
              style={[styles.button]}
              onPress={() => {handleOption1(), setVisible(false)}}
            >
              <Text style={styles.buttonText}>{option1}</Text>
            </TouchableOpacity>
        {option2 ? <TouchableOpacity
              style={[styles.button]}
              onPress={() => {handleOption2(), setVisible(false)}}
            >
              <Text style={styles.buttonText}>{option2}</Text>
            </TouchableOpacity> : null}
            
            {option3 ?   <TouchableOpacity
              style={[styles.button]}
              onPress={() => {handleOption3(),setVisible(false)}}
            >
              <Text style={styles.buttonText}>{option3}</Text>
            </TouchableOpacity> : null}

          
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignItems: "stretch",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: Colors.secondary
  },
  buttonText:{
    color: "white", fontWeight: "bold"
  }
});
