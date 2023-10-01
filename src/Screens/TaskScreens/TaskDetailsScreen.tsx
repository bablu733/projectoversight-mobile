import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../../Models/Task';
import POInputField from '../../Components/POSInputField';

type TaskDetailsProps = {
  route: {
    params: {
      task: Task;
    };
  };
};

const TaskDetailsScreen: React.FC<TaskDetailsProps> = ({ route }) => {
  const { task } = route.params;
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.headingText}>Task Details</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.title}>Task Details</Text>
        
        {/* Non-editable Task Name */}
        <View style={styles.formField}>
          <Text style={styles.fieldValue}>{task.name}</Text>
        </View>
        
        {/* Editable Task Type */}
        <POInputField
          label="Task Type"
          value={task.taskType}
          onChangeText={(newTaskType) => task.taskType = newTaskType}
          secureTextEntry={false}
          placeholder=""
          NonEditablelabel="Task Type"
        />

        {/* Editable Description */}
        <POInputField
          label="Description"
          value={task.description}
          onChangeText={(newDescription) => task.description = newDescription}
          secureTextEntry={false}
          placeholder=""
          NonEditablelabel="Description"
        />

        {/* Non-editable Percentage */}
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Percentage:</Text>
          <Text style={styles.fieldValue}>{task.percentage}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: 30,
    marginHorizontal: 24,
    backgroundColor: '#3A9EC2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomView: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
  },
  headingText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    marginTop: 10,
  },
  title: {
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 20,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
  },
});

export default TaskDetailsScreen;
