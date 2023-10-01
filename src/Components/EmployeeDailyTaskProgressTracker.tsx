import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { EmployeeStackParamList } from '../Routes/EmployeeStack';
import { LinearGradient } from 'expo-linear-gradient';

type DailyTaskListRouteProps = RouteProp<EmployeeStackParamList, "EmployeeDailyTaskDetails">;

interface Props {
    
    selectedSubCategory: string;
}

const EmployeeDailyTaskProgressTracker: React.FC<Props> = () => {
    const route2 = useRoute<DailyTaskListRouteProps>();

    const [Name] = React.useState<string>(route2.params.EmployeeDailyTask.name);
    const [ProjectName] = React.useState<string>(route2.params.EmployeeDailyTask.projectName);
debugger;
    return (
        <View style={styles.cardContainer}>
             <LinearGradient
        colors={['#93a5cf', '#e4efe9']}
        style ={{paddingTop:7,borderRadius:10}}
      >
        {ProjectName ? (<View style={styles.progressContainer}>
                <View style={[styles.stepContainer]}>
                    {ProjectName ? (
                        <View style ={styles.fill}>
                             <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                           <Text style={styles.stepText}>&#8226;</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.stepLabel}>Project Name: {ProjectName} </Text>
            </View>): null}
            {Name ? (  <View style={styles.progressContainer}>
                <View style={styles.stepContainer}>
                    {Name ? (
                      <View style ={styles.fill}>
                            <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepText}>&#8226;</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.stepLabel}>Task Name: {Name}</Text>
            </View>): null}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 5,
        padding: 10,
        width: 300,
        marginLeft: 40,
        
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    background: {
        flex: 1,
      },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    fill:{
      marginLeft:-1
    },
    stepCircle: {
        width: 16,
        height: 16,
        borderRadius: 10,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:5,
    },
    stepText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    stepLine: {
        width: 2,
        height: 14,
        backgroundColor: '#4a90e2',
        position: 'absolute',
        top: 19,
    },
    stepLine1:{
        width: 2,
        height: 15,
        backgroundColor: '#4a90e2',
        position: 'absolute',
        top:-13,
    },
    stepLine3:{
        width: 2,
        height: 16,
        backgroundColor: '#4a90e2',
        position: 'absolute',
        top: 16,
        left:12
    },
    stepLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight:'bold',
    },
});

export default EmployeeDailyTaskProgressTracker;
