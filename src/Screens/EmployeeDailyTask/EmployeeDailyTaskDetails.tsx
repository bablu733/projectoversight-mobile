import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Modal, KeyboardAvoidingView, TouchableOpacity, Vibration } from 'react-native';
import { FontAwesome, Ionicons, Octicons } from '@expo/vector-icons';
import { useAxios } from '../../Contexts/Axios';
import { TaskModel } from '../../Models/TaskModel';
import { RouteProp, useRoute } from '@react-navigation/native';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import POInputField from '../../Components/POSInputField';
import POButton from '../../Components/POButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../Contexts/Auth';
import POInputBoxField from '../../Components/POInputBoxField';
import LottieAnimation from '../../Components/Animation';
import UpdateTaskPopup from '../../Components/UpdateTaskPopup';
import { EmployeeDailyTask } from '../../Models/EmployeeDailyTask';
import { SafeAreaView } from 'react-navigation';
import EmployeeDailyTaskProgressTracker from '../../Components/EmployeeDailyTaskProgressTracker';
import { Status } from '../../Constants/Status';
import FloatingButton from '../../Components/FloatingButton';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import EmployeeProgressTracker from '../../Components/EmployeeProgressTracker';
import { DailyTaskStat } from '../../Models/EmployeeStatistic';
import { Upload } from '../../Models/Upload';
import { Image } from 'react-native-animatable';


type EmployeeDailyTaskDetailsScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "EmployeeDailyTaskDetails">;

type TaskListRouteProps = RouteProp<EmployeeStackParamList, "EmployeeDailyTaskDetails">;

const EmployeeDailyTaskDetailsScreen: React.FC = () => {

    const axios = useAxios();
    const auth = useAuth();
    const route = useRoute<TaskListRouteProps>();
    const navigation = useNavigation<EmployeeDailyTaskDetailsScreenProp>();


    const [loading, setLoading] = React.useState(false);
    const [list, setList] = React.useState<TaskModel[]>([]);
    const [selectedTaskId] = React.useState(route.params?.EmployeeDailyTask.employeeTask.taskId);
    const [ProjectId] = React.useState(route.params?.EmployeeDailyTask.projectId);
    const [Percentage, setPercentage] = React.useState(route.params?.EmployeeDailyTask.percentage);
    const [Name, setName] = React.useState<string>(route.params.EmployeeDailyTask.name);
    const [Descr, setDescr] = React.useState<string>(route.params.EmployeeDailyTask.description);
    const [priority] = React.useState<string>(route.params.EmployeeDailyTask.priority);
    const [Statuss, setstatus] = React.useState<string>(route.params.EmployeeDailyTask.status);
    const [isPopupVisible, setIsPopupVisible] = React.useState(false);
    const employeeId = auth.loginData.employeeId;
    const [EmployeeDailyTaskId] = React.useState(route.params?.EmployeeDailyTask.id);
    const [EmployeeTaskId] = React.useState(route.params?.EmployeeDailyTask.employeeTaskId);
    const [EstTime] = React.useState(route.params?.EmployeeDailyTask.estTime);
    const [status, setStatus] = React.useState<string>("");
    const [employeeDailyTaskId] = React.useState(route.params?.EmployeeDailyTask.id);
    const [employeeDailyTask] = React.useState(route.params?.EmployeeDailyTask);
    const workedOn = new Date()
    const [listEmpTask, setListEmpTask] = React.useState<number>();
    const [listEmpDailyTask, setListEmpDailyTask] = React.useState<number>();
    const [DailyStat, setDailyStat] = React.useState<DailyTaskStat>();
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)
        const [isImageEnlarged, setImageEnlarged] = React.useState(false);
    const [image, setImage] = React.useState<string>("");
    const TaskImages = (data: Upload) => {
        setImage(data.images)
    }
      
    const workedOnDate = new Date(employeeDailyTask.workedOn);
    workedOnDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)      }

    React.useEffect(() => {
        loadConnectionList();
        getEmployeeTask();
        getEmployeeTaskStat();
        getUpload()
    }, []);

    const handleImagePress = () => {
        setImageEnlarged(!isImageEnlarged);
      };

    const loadConnectionList = async () => {
       debugger
        setLoading(true);
        axios.privateAxios
            .get<TaskModel[]>("/app/EmployeeTask/GetProjectTaskById?Id=" + selectedTaskId)
            .then((response) => {
                setLoading(false);
                setList(response.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error.response.data);
            });
    };

    const getEmployeeTask = async () => {
        setLoading(true);
        axios.privateAxios
            .get<EmployeeDailyTask>("/app/EmployeeDailyTask/GetEmployeeDailyTaskById?employeeId=" + employeeId + "&projectId=" + ProjectId)
            .then((response) => {
                setLoading(false); 
                setListEmpDailyTask(response.data.id)
                setListEmpTask(response.data.employeeTaskId);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error.response.data);
            });
        };
    
        const getEmployeeTaskStat = async () => {
            debugger
            setLoading(true);
            axios.privateAxios
                .get<DailyTaskStat>("/app/EmployeeDailyTask/GetEmployeeTaskStat?employeeId=" + employeeId + "&employeeTaskId=" + EmployeeTaskId)
                .then((response) => {
                    debugger;
                    setLoading(false); 
                    setDailyStat(response.data);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error.response.data);
                });
            };
    
        const getUpload = async () => {
            debugger
            setLoading(true);
            axios.privateAxios
              .get<Upload>("/app/Upload/GetDocument?TaskId=" + selectedTaskId)
              .then((response) => {
                debugger
                setLoading(false);
                TaskImages(response.data);
                console.log(response.data) // Set the image object directly, assuming it contains a property named "images"
              })
              .catch((error) => {
                setLoading(false);
                console.log(error.response.data);
              });
          };

    const CompleteTask = () => {
        setIsPopupVisible(true)
    };
    const commentsScreen = async (data:EmployeeDailyTask)=>{
        navigation.navigate('Comments',{TaskId:selectedTaskId,EmployeeTaskId:listEmpTask,EmployeeDailyTaskId:listEmpDailyTask,Name:Name,ProjectId:ProjectId})
    }

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };
    const handleBackPress = () => {
        navigation.goBack();
    };
    const handleSubmit = (actStartDate: Date, actTime: number, comments: string, actEndDate: Date,percentage :number) => {
        setLoading(true);
        const AssignRequest: EmployeeDailyTask = {
            id: EmployeeDailyTaskId,
            employeeId: employeeId,
            taskId: selectedTaskId,
            employeeTaskId: EmployeeTaskId,
            projectObjectiveId: 1,
            projectId: ProjectId,
            name: Name,
            employeeName : "",
            projectName: "",
            description: Descr,
            startDate: actStartDate,
            endDate: actEndDate,
            estTime: EstTime,
            actTime: actTime,
            weekEndingDate: undefined,
            status: status,
            priority: "high",
            percentage: percentage,
            comment: comments,
            workedOn:workedOn
        };
        axios.privateAxios
            .post<EmployeeDailyTask>("/app/EmployeeDailyTask/AddEmployeeDailyTask", AssignRequest)
            .then((response) => {
                console.log(response.data);
                setLoading(false);
                showMessage({
                    message: 'Daily Task Updated Successfully!',
                    type: 'success',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                });
                navigation.navigate('Time')
            })
            .catch((error) => {
                setLoading(false);
                showMessage({
                    message: 'error occured',
                    type: 'danger',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="alert-circle-outline" size={20} />
                    ),
                });
                handleClosePopup();
            });
    }

    return (
        <View style={styles.container}>
           <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
            <View style={[styles.topView]}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons
                        name="chevron-back"
                        size={30}
                        color="#fff"
                        style={styles.backButton}
                        onPress={handleBackPress}
                    />
                </TouchableOpacity>

                <Text style={styles.headingText}>Daily Task Update</Text>
            </View>

            <View style={styles.bottomView}>
                <SafeAreaView>
                <EmployeeDailyTaskProgressTracker></EmployeeDailyTaskProgressTracker>
                </SafeAreaView>
                {DailyStat != null?
                <Text style={styles.titleText}>Task Details {DailyStat.dailyTaskAct??0}/{DailyStat.dailyTaskEst??0}/{DailyStat.employeeTaskEst??0}</Text>
                :
                <Text style={styles.titleText}>Task Details</Text>}
                {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons/Loading.json')}
                        autoPlay={true}
                        loop={false}
                        visible={loading}
                    />
                )}
                <ScrollView style={styles.scrollView}>
                    <View style={styles.input}>
                        <POInputField
                            label={"Name"}
                            placeholder={"Name"}
                            value={Name}
                            onChangeText={setName}
                            secureTextEntry={false}
                            keyboardType={"default"}
                            editable={false}
                            NonEditablelabel='Name'
                        ></POInputField>

                        <POInputBoxField
                            label="Description"
                            placeholder="Description"
                            value={Descr}
                            onChangeText={setDescr}
                            secureTextEntry={false}
                            editable={false}
                            NonEditablelabel='Description'
                        ></POInputBoxField>


                        <POInputField
                            label={'Percentage'}
                            placeholder={'Percentage'}
                            value={Percentage === 0 ? '0' : Percentage.toString()}
                            onChangeText={setPercentage}
                            secureTextEntry={false}
                            keyboardType={'default'}
                            editable={false}
                            NonEditablelabel="Percentage"
                        />
                        <POInputField
                            label={'Estimate'}
                            placeholder={'Estimate'}
                            value={EstTime}
                            onChangeText={setPercentage}
                            secureTextEntry={false}
                            keyboardType={'default'}
                            editable={false}
                            NonEditablelabel="Estimate"
                        />
                        <POInputField
                            label={"Status"}
                            placeholder={"Status"}
                            value={Statuss}
                            onChangeText={setstatus}
                            secureTextEntry={false}
                            keyboardType={"default"}
                            editable={false}
                            NonEditablelabel='Status'
                        ></POInputField>
                        <UpdateTaskPopup
                            isVisible={isPopupVisible}
                            onClose={handleClosePopup}
                            onSubmit={handleSubmit}
                            initialPercentage={Percentage === 0 ? '0' : Percentage}
                        />

                    </View>
                    <View>
                        {image !== "" && image !== null && image !== undefined ? (
                            <TouchableOpacity onPress={handleImagePress}>
                                <Image
                                    source={{ uri: `data:image/png;base64,${image}` }}
                                    style={styles.popupImage}
                                />
                            </TouchableOpacity>

                        ) : (
                            null
                        )}
                        <Modal visible={isImageEnlarged} transparent={true} onRequestClose={handleImagePress}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity onPress={handleImagePress} style={styles.modalBackground}>
                                    <Image
                                        source={{ uri: `data:image/png;base64,${image}` }}
                                        style={styles.enlargedImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
                <View style={[styles.icons]}>
                        {workedOnDate >= currentDate ? (
                            <View style={[styles.text]}>
                                <TouchableOpacity style={[styles.Complete]} onPress={CompleteTask}>
                                    <Octicons name="tasklist" size={24} color="#fff" />
                                </TouchableOpacity>
                                <Text>Complete Task</Text>
                            </View>
                        ):null}
                            <View style={[styles.text]}>
                                <TouchableOpacity style={[styles.Complete]} onPress={commentsScreen}>
                                    <FontAwesome name="comments" size={35} color="#fff" />
                                </TouchableOpacity>
                                <Text>Comments</Text>
                            </View>
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
    scrollView: {
        flex: 1,
        marginBottom: -300, // Adjust this value as needed to avoid overlapping with the floating button
      },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalBackground: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      enlargedImage: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
      },
    popupImage: {
        width: 80,
        height: 80,
        left:10,
        bottom:14
      },
    topView: {
        marginTop: 30,
        marginHorizontal: 24,
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    headingText: {
        marginRight:50,
        top: 15,
        textAlign: 'center',
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomView: {
        flex: 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        padding: 20,
      },
    title: {
        marginHorizontal: 26,
        marginVertical: 16,
        fontWeight: 'bold',
        fontSize: 20,
    },

    titleText: {
        marginHorizontal: 26,
        marginVertical: 20,
        fontWeight: 'bold',
        fontSize: 20,
    },

    input: {
        margin: 10,
    },
    AssignButton: {
        backgroundColor: '#35A2C1',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        top: 30,
        margin: 20
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 50,
        marginHorizontal: 20,
        alignSelf: 'stretch',
        height: 500,
        width: "90%"
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    textarea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        height: 100,
        marginBottom: 10,
    },
    popupButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    popupButton: {
        backgroundColor: '#35A2C1',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: 10,
    },
    popupButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#35A2C1',
        height: 45,
        width: "80%",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        left: 30,
        bottom:10
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 20,
        marginTop: 10,
    },
    backButton: {
        left:-5,
        top:8,
    },
    animation: {
        position: 'absolute',
        width: '140%',
        height: '140%',
    },
    StickyButton: {
        position: 'absolute',
        bottom:70,
        right: 20,
        width: 130,
        height: 40,
        backgroundColor: '#35A2C1',
        justifyContent: 'center',
        alignItems: 'center',
      },
      icons:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        bottom: 60
    },
    text:{
        alignItems: 'center',
     marginTop:10
      
    },

    Complete: {
        bottom: 10,
        width: 60,
        height: 60,
        top:5,
        borderRadius: 30,
        backgroundColor: '#35A2C1',
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default EmployeeDailyTaskDetailsScreen;
