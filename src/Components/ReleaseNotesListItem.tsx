import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';

interface Props {
  Name: string;
  TaskDescription: string;
  onPress: () => void;
  Status: string;
  taskId,
  handleCheckboxToggle,
  
}

const ReleaseNotesListItem: React.FC<Props> = ({ Name, TaskDescription, onPress, Status, handleCheckboxToggle,taskId }) => {

  const [checked, setChecked] = React.useState(false);

  // const handleCheckboxToggle = () => {
  //   setChecked(!checked);
  // };
 
  return (
    <View style={styles.container}>
      <View style={styles.row}>
      <CheckBox checked={checked} onPress={() => {
          setChecked(!checked);
          handleCheckboxToggle(taskId); // Call the function and pass the taskId
        }} />
        <TouchableOpacity style={styles.detailsContainer} onPress={onPress}>
          <View style={styles.detailsContainer}>
            <Text style={styles.boldText}>
              Name: <Text style={styles.normalText}>{Name}</Text>
            </Text>
            <Text style={styles.boldText}>
              Task Description: <Text style={styles.normalText}>{TaskDescription}</Text>
            </Text>
            <Text style={styles.boldText}>
              Status: <Text style={styles.normalText}>{Status}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECE5DD',
    borderRadius: 30,
    padding: 16,
    marginBottom: 16,
    elevation: 5,
    margin: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    right:20
  },
  detailsContainer: {
    marginLeft:0,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  normalText: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: 'normal',
    flexWrap:'wrap'
  },
});

export default ReleaseNotesListItem;