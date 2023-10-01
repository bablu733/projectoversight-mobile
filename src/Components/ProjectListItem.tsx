import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CustomListItemProps {
  item: {
    id: number;
    title: string;
    description: string;
    attribute1: string;
    attribute2: string;
    attribute3: string;
    attribute4: string;
  };
  onPress: () => void;
}

const ProjectListItem: React.FC<CustomListItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text>{item.attribute1}</Text>
        <Text>{item.attribute2}</Text>
        <Text>{item.attribute3}</Text>
        <Text>{item.attribute4}</Text>
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
    margin:15
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
  },
});

export default ProjectListItem;
