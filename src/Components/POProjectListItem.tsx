import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';

interface Props {
  Name: string;
  Type: string;
  Description: string;
  onPress: () => void;
  percentage: number;
}

const POProjectListItem: React.FC<Props> = ({
  Name,
  Type,
  Description,
  onPress,
  percentage,
}) => {
  let progressColor = '#4287f5'; // Default color

  if (percentage >= 0 && percentage < 25) {
    progressColor = 'red';
  } else if (percentage >= 25 && percentage < 50) {
    progressColor = 'yellow';
  } else if (percentage >= 50 && percentage < 95) {
    progressColor = 'orange';
  } else if (percentage >= 95 && percentage <= 100) {
    progressColor = 'green';
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View>
        <Text style={styles.boldText}>
          Name: <Text style={styles.normalText}>{Name}</Text>
        </Text>
        <Text style={styles.boldText}>
          Type: <Text style={styles.normalText}>{Type}</Text>
        </Text>
        <Text style={styles.boldText}>
          Description: <Text style={styles.normalText}>{Description}</Text>
        </Text>
        <View style={styles.row}>
          <Text style={styles.boldText}>Status: </Text>
          <View style={styles.progressBar}>
            <ProgressBar progress={percentage / 100} color={progressColor} style={styles.progress} />
          </View>
          <Text style={styles.normalText}>{percentage} %</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFF6FF',
    borderRadius: 30,
    padding: 16,
    marginBottom: 16,
    elevation: 5,
    margin: 15,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Roboto',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginLeft: 8,
    marginRight: 4,
  },
  progress: {
    height: 10,
    borderRadius: 5,
  },
});

export default POProjectListItem;
