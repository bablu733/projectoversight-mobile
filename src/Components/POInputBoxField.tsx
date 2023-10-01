import * as React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "@react-native-material/core";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: any;
  numberOfLines: number;
  multiline: boolean;
  secureTextEntry: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
  autoFocus?: boolean;
  mandatory?: boolean;
  NonEditablelabel:string;
}

const POInputBoxField: React.FC<Props> = ({
  label = "",
  placeholder = "",
  value,
  onChangeText,
  numberOfLines = 4,
  multiline = true,
  secureTextEntry = false,
  keyboardType = "default",
  maxLength = 20000,
  editable = true,
  autoFocus = false,
  mandatory = false,
  NonEditablelabel =""
}) => {
  const formattedValue = (value: any) => {
    return value ? value.toString() : "";
  };
  return (
    <View style={styles.container}>

        {/* <Text style={mandatory ? styles.mandatory : styles.notMandatory}> *</Text> */}
      <TextInput
        variant="standard"
        label={editable ?label :<Text style={styles.label}>{NonEditablelabel}</Text>}
        style={styles.input}
        onChangeText={onChangeText}
        numberOfLines={numberOfLines}
        multiline={multiline}
        value={formattedValue(value)}
        //placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
        autoFocus={autoFocus}
        color={"#3A9EC2"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 2,
    paddingBottom: 5,
    fontWeight: "bold",
    color: "#256D85",
    fontSize:14
  },
  input: {
    padding: 10,
  },
  mandatory: {
    color: "red",
  },
  notMandatory: {
    color: "white",
  },
  isReadonly: {
    borderWidth: 1,
    borderColor: "#256D85",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#B1B1B1",
    color: "black",
  }
});

export default POInputBoxField;
