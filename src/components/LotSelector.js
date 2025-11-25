import { useState } from "react";
import {
  StyleSheet,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const LotSelector = ({ availableLots, onLotSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(
    availableLots.map((lot) => ({ label: lot, value: lot }))
  );

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select a Lot"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={{ color: "#000", fontSize: 16, fontWeight: 700 }}
        zIndex={3000}
        zIndexInverse={1000}
        listMode="FLATLIST"
        onChangeValue={(val) => {
          onLotSelect(val);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    zIndex: 3000,
  },
  dropdown: {
    borderColor: "#ccc",
    zIndex: 3000,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    zIndex: 3000,
  },
});

export default LotSelector;
