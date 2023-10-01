import React ,{useEffect}from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { EmployeeStackParamList } from '../Routes/EmployeeStack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAxios } from '../Contexts/Axios';
import { TaskModel } from '../Models/TaskModel';

type TaskListRouteProps = RouteProp<EmployeeStackParamList, "DayPlanTaskScreen">;
type TaskListRoute = RouteProp<EmployeeStackParamList, "DayPlanTaskDetails">;
type CommentsRoute = RouteProp<EmployeeStackParamList, "Comments">;
type AddDayPlanRoute = RouteProp<EmployeeStackParamList, "AddDayPlanTaskDetails">;

interface Props {
    
    selectedSubCategory: string;
}

const EmployeeProgressTracker: React.FC<Props> = () => {
    const route = useRoute<TaskListRouteProps>();
    const route1 = useRoute<TaskListRoute>();
    const route2 = useRoute<CommentsRoute>();
    const route3 = useRoute<AddDayPlanRoute>();
    const axios = useAxios();

    const [ProjectName] = React.useState<string>(route.params.ProjectName ?? route3.params.projectName);
    const [taskName] = React.useState<string>(route1.params.Name ?? route3.params.taskName);
    const [TaskId] = React.useState(route2.params.EmployeeTaskId);
    const [taskDescription, setTaskDescription] =React.useState<string>();
    

    const loadConnectionLists = async () => {
        
        setTimeout(() => {
        axios.privateAxios
            .get<TaskModel>("/app/EmployeeTask/GetTaskDetalisById?TaskId="+TaskId)
            .then((response) => {
            setTaskDescription(response.data.taskDescription)
            })
            .catch((error) => {
               
                console.log(error.response.data);
            });
        }, 1000);
    };

    useEffect(() => {
        loadConnectionLists();
      }, []);

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
            {taskDescription ? (<View style={styles.progressContainer}>
                <View style={[styles.stepContainer]}>
                    {taskDescription ? (
                        <View style ={styles.fill}>
                             <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                           <Text style={styles.stepText}>&#8226;</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.stepLabel}>Task Description: {taskDescription} </Text>
            </View>): null}

            {taskName ? (  <View style={styles.progressContainer}>
                <View style={styles.stepContainer}>
                    {taskName ? (
                      <View style ={styles.fill}>
                            <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepText}>&#8226;</Text>
                        </View>
                    )}
                    <View style={styles.stepLine1} />
                </View>
                <Text style={styles.stepLabel}>Task Name: {taskName}</Text>
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

export default EmployeeProgressTracker;
