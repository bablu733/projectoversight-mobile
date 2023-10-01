import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from '@react-native-material/core';
import { Ionicons } from '@expo/vector-icons';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  placeholder?: string;
  data: Option[];
  value: string | number;
  disable: boolean;
  setValue: React.Dispatch<React.SetStateAction<string | number>>;
  onChange?: (value: string | number) => void;
  mandatory?: boolean;
}

const DropDown: React.FC<Props> = ({
  label = '',
  placeholder = '',
  data,
  disable = false,
  setValue,
  value,
  onChange,
  mandatory = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelection = (option: Option) => {
    setValue(option.value);
    setShowOptions(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <>
      {/* <Text style={styles.label}>
        {label} */}
        <Text style={mandatory ? styles.mandatory : styles.notMandatory}> *</Text>
      {/* </Text> */}

      <TouchableOpacity onPress={toggleOptions}>
          <TextInput
            variant="standard"
            label={label}
            value={value.toString()}
            editable={false}
            style={styles.input}
            color="#3A9EC2"
            trailing={<Ionicons name="caret-down-outline" size={22} color="black"/>}
          />
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.value.toString()}
              style={styles.option}
              onPress={() => handleOptionSelection(item)}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 0.5,
    paddingBottom: 3.5,
    fontWeight: 'bold',
    color: '#256D85',
  },
  mandatory: {
    color: 'red',
  },
  notMandatory: {
    color: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#256D85',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginTop: 6,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: 'gray',
    fontSize: 16,
    padding: 10,
  },
  optionsContainer: {
    backgroundColor: '#fff', // Set the background color to black
    borderRadius: 10,
    marginTop: 6,
    maxHeight: 200,
    elevation: 2,
    borderColor: '#000', // Set the border color to black
    borderWidth: 1, // Set the width of the border (optional)
  },
  
  option: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default DropDown;
