import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { BlurView } from 'expo-blur';

interface Props {
  Name: string;
  TaskDescription: string;
  Status:string;
  onPress: () => void;
  EstimationTime: string;
  isSelected: boolean;
}

const POWhatsAppListItem: React.FC<Props> = ({ Name,Status, TaskDescription, onPress, EstimationTime, isSelected }) => {
  const [checked, setChecked] = React.useState(false);

  const handleCheckboxToggle = () => {
    setChecked(!checked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CheckBox checked={isSelected} onPress={onPress} />
        <TouchableOpacity style={[styles.detailsContainer,isSelected && styles.selectedContainer]} onPress={onPress}>
        {isSelected && (
        <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="default" />
      )}
          <View style={styles.detailsContainer}>
            <Text style={styles.boldText}>
              Name: <Text style={styles.normalText}>{Name}</Text>
            </Text>
            <Text style={styles.boldText}>
              Task Description:<Text style={styles.descriptionText} numberOfLines={2}>
              {TaskDescription}
            </Text></Text>
            <Text style={styles.boldText}>
              Status: <Text style={styles.normalText}>{Status}</Text>
            </Text>
            <Text style={styles.boldText}>
              Estimation Time: <Text style={styles.normalText}>{EstimationTime}</Text>
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
    margin:15,
    right:40
  },
  detailsContainer: {
    //marginLeft:-5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  normalText: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'normal',
    flexWrap: 'wrap',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  selectedContainer: {
    backgroundColor: '#DCE7F1',
  },
});

export default POWhatsAppListItem;
