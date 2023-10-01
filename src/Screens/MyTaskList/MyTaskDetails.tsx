import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';

const FormPropsTextFields = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Required</Text>
        <TextInput style={styles.input} defaultValue="Hello World" />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Disabled</Text>
        <TextInput style={styles.input} defaultValue="Hello World" editable={false} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} secureTextEntry={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Read Only</Text>
        <TextInput style={styles.input} defaultValue="Hello World" editable={false} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Number</Text>
        <TextInput style={styles.input} keyboardType="numeric" />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Search field</Text>
        <TextInput style={styles.input} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Helper text</Text>
        <TextInput style={styles.input} defaultValue="Default Value" />
        <Text style={styles.helperText}>Some important text</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    marginRight: 8,
    width: 100,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  helperText: {
    marginLeft: 8,
    color: '#888',
  },
});

export default FormPropsTextFields;
