import React from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Modal, KeyboardAvoidingView, TouchableOpacity,Vibration,SafeAreaView } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAxios } from '../../Contexts/Axios';
import { TaskModel } from '../../Models/TaskModel';
import { RouteProp, useRoute } from '@react-navigation/native';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import POInputField from '../../Components/POSInputField';
import POButton from '../../Components/POButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DayPlanModel } from '../../Models/DayPlanModel';
import { useAuth } from '../../Contexts/Auth';
import TaskDetailsPopup from '../../Components/CreateTaskPopup';
import POInputBoxField from '../../Components/POInputBoxField';
import LottieAnimation from '../../Components/Animation';
import EmployeeProgressTracker from '../../Components/EmployeeProgressTracker';
import { EmployeeTask } from '../../Models/EmployeeTask';
import AssignTaskPopup from '../../Components/AssignTaskPopup';
import FloatingButton from '../../Components/FloatingButton';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Status } from '../../Constants/Status';
import { Upload } from '../../Models/Upload';
import ImageModal from 'react-native-image-modal';
import { Image } from 'react-native-animatable';



type PlanScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "DayPlanTaskDetails">;

type TaskListRouteProps = RouteProp<EmployeeStackParamList, "DayPlanTaskDetails">;

const DayPlanTaskDetailsScreen: React.FC = () => {

    const axios = useAxios();
    const auth = useAuth();
    const route = useRoute<TaskListRouteProps>();
    const navigation = useNavigation<PlanScreenProp>();


    const [loading, setLoading] = React.useState(false);
    const [list, setList] = React.useState<TaskModel[]>([]);
    const [selectedTaskId] = React.useState(route.params?.Id);
    const [ProjectId] = React.useState(route.params?.ProjectId);
    const [Percentage] = React.useState(route.params?.percentage);
    const [Name, setName] = React.useState<string>(route.params.Name);
    const [Descr, setDescr] = React.useState<string>(route.params.description);
    const [priority] = React.useState<string>(route.params.priority);
    const [status, setstatus] = React.useState<string>(route.params.status);
    const [isPopupVisible, setIsPopupVisible] = React.useState(false);
    const employeeId = auth.loginData.employeeId;
    const [ProjectName] = React.useState<string>(route.params.ProjectName);
    const [Assignedtask, setAssigendTask] = React.useState<boolean>();
    //const [employeeTaskId] = React.useState(route.params?.Id);
    const [listEmpTask, setListEmpTask] = React.useState<number>();
    const [estimate] = React.useState(route.params?.estimate);    const [isImageEnlarged, setImageEnlarged] = React.useState(false);
    const [image, setImage] = React.useState<string>("");
    const TaskImages = (data: Upload) => {
        setImage(data.images)
      
      }
    React.useEffect(() => {
        Promise.all([
        loadConnectionList(),
        getEmployeeTask(),
        getUpload()
        ])
    }, []);

    const handleImagePress = () => {
        setImageEnlarged(!isImageEnlarged);
      };

    const loadConnectionList = async () => {
        debugger
        setLoading(true);
        axios.privateAxios
            .get<boolean>("/app/EmployeeTask/GetEmployeeTaskbyId?EmployeeId=" +employeeId + "&TaskId=" + selectedTaskId)
            .then((response) => {
                setLoading(false); 
                setAssigendTask(response.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error.response.data);
            });
    };

    const getEmployeeTask = async () => {
        debugger
        setLoading(true);
        axios.privateAxios
            .get<DayPlanModel>("/app/EmployeeTask/GetAssignedEmployeeTaskById?projectId=" + ProjectId + "&TaskId=" + selectedTaskId)
            .then((response) => {
                debugger;
                setLoading(false); 
                setListEmpTask(response.data.id);
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
        

    const CreateTask = () => {
        setIsPopupVisible(true)
    };
    const CreateDayPlan = () => {
        debugger;
        navigation.navigate('AddDayPlanTaskDetails',{employeeTaskId:listEmpTask,projectName:ProjectName,taskName: Name,ProjectId:ProjectId, taskId:selectedTaskId})
    };
   

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };
    const handleBackPress = () => {
        navigation.goBack();
    };

    const commentsScreen = async(data:DayPlanModel) => {
        debugger
        navigation.navigate('Comments',{TaskId:selectedTaskId,EmployeeTaskId:listEmpTask,Name:Name,ProjectId:ProjectId,EmployeeDailyTaskId:undefined})
    }

        const handleSubmit = (estStartDate: Date, estTime: number, comments: string , estEndDate:Date,weekEndDate:Date) => {
        debugger
        const AssignRequest: DayPlanModel = {
            employeeId: employeeId,
            taskId: selectedTaskId,
            projectId: ProjectId,
            name: Name,
            description: Descr,
            startDate: undefined,
            endDate: undefined,
            estTime: estTime,
            actTime: 0,
            weekEndingDate: weekEndDate,
            status:status,
            priority: priority,
            percentage: Percentage,
            estStartDate:estStartDate,
            estEndDate:estEndDate,
            Comment: comments,  
            createdBy:employeeId.toString()   
        };

        axios.privateAxios
            .post<DayPlanModel>("/app/EmployeeTask/AssignEmployeeTask", AssignRequest)
            .then((response) => {
                debugger
                console.log(response.data);
                showMessage({
                    message: 'Task Assigned Successfully!',
                    type: 'success',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                });
                navigation.navigate("DayPlanTaskScreen", { ProjectId: ProjectId ,ProjectName: ProjectName});
            })
            .catch((error) => {
                console.log(error.response.data)
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

                <Text style={styles.headingText}>Task Assignment</Text>
            </View>

            <View style={styles.bottomView}>
            <SafeAreaView>
    <EmployeeProgressTracker></EmployeeProgressTracker>
      
  </SafeAreaView>
                <Text style={styles.titleText}>Task Details</Text>
                {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons//Loading.json')}
                        autoPlay={true}
                        loop={false}
                        visible={loading}
                        style={styles.animation}
                    />
                )}
                <ScrollView>
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
                            label={"Status"}
                            placeholder={"Status"}
                            value={status}
                            onChangeText={setstatus}
                            secureTextEntry={false}
                            keyboardType={"default"}
                            editable={false}
                            NonEditablelabel='Status'
                        ></POInputField>

                        <POInputField
                            label={"Estimate"}
                            placeholder={"Estimate"}
                            value={estimate}
                            onChangeText={setstatus}
                            secureTextEntry={false}
                            keyboardType={"default"}
                            editable={false}
                            NonEditablelabel='Estimate'
                        ></POInputField>
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

                        <View style={[styles.icons]}>
                        {status === "Unassigned"?(
                            <View style={[styles.text]}>
                                <TouchableOpacity style={[styles.Assign]}  onPress={CreateTask}>
                                    <FontAwesome name="tasks" size={35} color="#fff" />
                                </TouchableOpacity>
                                <Text>Assign Tasks</Text>
                            </View>
                        ):null}
                        {status != "Unassigned"? (
                            <View style={[styles.text]}>
                                <TouchableOpacity style={[styles.Assign]} onPress={CreateDayPlan}>
                                    <MaterialCommunityIcons name="clock-edit-outline" size={35} color="#fff" />
                                </TouchableOpacity>
                                <Text>Day Plan</Text>
                            </View>
                        ):null}
                            <View style={[styles.text]}>
                                <TouchableOpacity style={[styles.Assign]} onPress={commentsScreen}>
                                    <FontAwesome name="comments" size={35} color="#fff" />
                                </TouchableOpacity>
                                <Text>Comments</Text>
                            </View>
                            <AssignTaskPopup
                            isVisible={isPopupVisible}
                            onClose={handleClosePopup}
                            onSubmit={handleSubmit}
                        />
                        </View>
                </View>
                </ScrollView>
            </View>
           
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A9EC2',
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
        left:10
      },
    topView: {
        marginTop: 30,
        marginHorizontal: 24,
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText: {
        position: 'absolute',
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
        Padding: 20,
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
        marginBottom: 20,
        left: 30,
        top:1,
        bottom:20
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 20,
        marginTop: 10,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        bottom: 28,
    },
    animation: {
        position: 'absolute',
        width: '140%',
        height: '140%',
    },
    StickyButton: {
        position: 'absolute',
        bottom:65,
        right: 20,
        width: 130,
        height: 40,
        backgroundColor: '#35A2C1',
        justifyContent: 'center',
        alignItems: 'center',
      },
      text:{
        alignItems: 'center',
     marginTop:10
      
    },

    icons: {
        bottom:10,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    Assign: {
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

export default DayPlanTaskDetailsScreen;
