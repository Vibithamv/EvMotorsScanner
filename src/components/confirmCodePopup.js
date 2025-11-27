import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  TextInput,
} from "react-native-paper";
import { Colors } from "../utils/AssetManager";

export default function ConfirmCodePopup({ visible, onDismiss, onConfirm }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setCode("");
      setError("");
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (!code.trim()) {
      setError("Please enter confirmation code");
      return;
    }

    setError("");
    onConfirm(code.trim());
  };

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: Colors.text }}
        visible={visible}
       // onDismiss={onDismiss}
      >
        <Dialog.Title
          style={{ alignSelf: "center", textAlign: "center", fontSize: 18 }}
        >
          Enter Confirmation Code
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            mode="outlined"
            // label="Confirmation Code"
            keyboardType="numeric"
            value={code}
            style={{ height: 50 }}
            onChangeText={(t) => {
              setCode(t);
              if (error) setError("");
            }}
          />
          {error ? <HelperText type="error">{error}</HelperText> : null}
        </Dialog.Content>
        <Dialog.Actions
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Button
            style={{
              borderRadius: 8,
              flex: 1,

              alignItems: "center",
              textAlign: "center",
              backgroundColor: Colors.secondary,
            }}
            labelStyle={{ color: "white" }}
            onPress={onDismiss}
          >
            Cancel
          </Button>
          <Button
            style={{
              borderRadius: 8,
              flex: 1,

              alignItems: "center",
              textAlign: "center",
              backgroundColor: Colors.secondary,
            }}
            labelStyle={{ color: "white" }}
            onPress={handleConfirm}
          >
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
