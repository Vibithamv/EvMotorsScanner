import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  TextInput,
} from "react-native-paper";

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
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Enter Confirmation Code</Dialog.Title>
        <Dialog.Content>
          <TextInput
            mode="outlined"
            label="Confirmation Code"
            keyboardType="numeric"
            value={code}
            onChangeText={(t) => {
              setCode(t);
              if (error) setError("");
            }}
          />
          {error ? <HelperText type="error">{error}</HelperText> : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleConfirm}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
