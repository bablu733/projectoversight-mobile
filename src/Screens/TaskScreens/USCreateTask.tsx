import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, Modal, ScrollView, Button, TouchableOpacity, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import POInputField from '../../Components/POSInputField';
import POButton from '../../Components/POButton';
import { useAxios } from '../../Contexts/Axios';
import { Status } from '../../Constants/Status'
import { Task } from '../../Models/Task';
import { useAuth } from '../../Contexts/Auth';
import TaskDetailsPopup from '../../Components/CreateTaskPopup';
import POInputBoxField from '../../Components/POInputBoxField';
import ProgressTrackerCard from '../../Components/ProgressTrackerCard';
import LottieAnimation from '../../Components/Animation';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import DropDown from '../../Components/DropDown';
import DatePickerWeekEndingDate from '../../Components/DatePickerWeekEndingDate';
import PODateTimePicker from '../../Components/PODateTimePicker';
import FloatingButton from '../../Components/FloatingButton';
import { CommonMaster } from '../../Models/CommonMaster';
import PosCapturePhoto from '../../Components/PosCapturePhoto';
import { File } from '../../Models/request/File';
//Navigation
type AssignScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Assign">;

//Props
type TaskListRouteProps = RouteProp<EmployeeStackParamList, "Assign">;

const AssignTaskScreen: React.FC = () => {
    const axios = useAxios();
    const navigation = useNavigation<AssignScreenProp>();
    const route = useRoute<TaskListRouteProps>();
    const auth = useAuth();
    const [projectId] = React.useState(route.params?.projectId);
    const [userStoryId] = React.useState(route.params?.userStoryId);
    const [loading, setLoading] = React.useState(false);
    const [UserName, setUserName] = React.useState<string>("");
    const [description, setDesciption] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [status, setStatus] = React.useState<string>(Status.UnAssigned);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [error, setError] = React.useState<string>();
    const employeeId = auth.loginData.employeeId;
    const [estTime, setEstTime] = useState('');
    const [CategoryId] = React.useState<number>(route.params.CategoryIds);
    const [UserStoryName] = React.useState<string>(route.params.USName);
    const [Description] = React.useState<string>(route.params.Description);
    const [UserStoryId] = React.useState<number>(route.params.userStoryId);
    const [estStartDate, setEstStartDate] = useState<Date>();
    const [estEndDate, setEstEndDate] = useState<Date>();
    const [Comments, setComments] = useState('');
    const [TaskTypeOptions, setTaskTypeOptions] = useState<string[]>([]);
    const [TaskTypeValue, setTaskTypeValue] = useState('');
    const [ClassificationOptions, setClassificationOptions] = useState<string[]>([]);
    const [ClassificationValue, setClassificationValue] = useState('');
    const [StartDateerror, setEstStartDateError] = React.useState<string>("");
    const [EndDateerror, setEstEndDateError] = React.useState<string>("");
    const [EstTimeerror, setEstTimeError] = React.useState<string>("");
    const [tasktypeerror, setTaskTypeError] = React.useState<string>("");
    const [Classificationerror, setClassificationError] = React.useState<string>("");
    const [Commentserror, setCommentsError] = React.useState<string>("");
    const [weekEndDate, setWeekEstEndDate] = useState<Date>();
    const [weekEndDateerror, setWeekEstEndDateError] = useState('');
    const [TaskDescription, setTaskDescription] = React.useState<string>("");
    const [TaskDescriptionerror, setTaskDescriptionerror] = React.useState<string>("");
    const [checkList, setCheckList] = useState(['']);
    const [showChecklist, setShowChecklist] = useState(false);
    const [showDeleteIcon, setShowDeleteIcon] = useState(false);
    const [TaskName, setTaskName] = React.useState<string>("");
    const [TaskNameerror, setTaskNameerror] = React.useState<string>("");
    const [checkListItems, setCheckListItems] = useState<string[]>(['']);
    const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
    const [selectedImageCount1,setImageCount1]=React.useState<any>(0);

    useEffect(() => {
        loadConnectionList();
    }, []);

    const loadConnectionList = async () => {
        try {
            const response = await axios.privateAxios.get<CommonMaster[]>("/app/CommonMaster/GetCodeTableList")
            const taskTypeSet = new Set();
            response.data.forEach((item) => {
                if (item.codeName === "TaskType") {
                    taskTypeSet.add(item.codeValue);
                }
            });
            const taskType = Array.from(taskTypeSet).map((codeValue) => ({
                label: codeValue,
                value: codeValue,
            }));

            const classificationSet = new Set();
            response.data.forEach((item) => {
                if (item.codeName === "TaskClassification") {
                    classificationSet.add(item.codeValue);
                }
            });
            const classification = Array.from(classificationSet).map((codeValue) => ({
                label: codeValue,
                value: codeValue,
            }));

            setTaskTypeOptions(taskType);
            setClassificationOptions(classification);

        } catch (error) {
            console.log(error.response.data);
        }
    };

    const isFormValid = () => {
        debugger
        if (
            (estTime === null || estTime === undefined)
        ) {
            setError("Estimation Required");
            return false;
        }
        return true;
    };
    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSubmit = () => {
        if (!isFormValid()) {
            return;
        }
        if (!estStartDate) {
            setEstStartDateError("Please Select Start Date");
          } else {
            setEstStartDateError(""); // Clear the error message if the date is selected
          }
        
          if (!estEndDate) {
            setEstEndDateError("Please Select End Date");
          } else {
            setEstEndDateError(""); // Clear the error message if the date is selected
          }
        setEstStartDateError("Please Select Start Date");
    setEstEndDateError("Please Select End Date");
    setEstTimeError("Please Enter Estimation Time");
    setTaskTypeError("Please Select Task Type");
    setClassificationError("Please Select Classification");
    setCommentsError("Please Enter Comments");
    setWeekEstEndDateError("Please Select Week Ending Date");
    setTaskDescriptionerror("Please Enter The Task Description");
  
    if (
        !estStartDate ||
        !estEndDate ||
      estTime.length === 0 ||
      TaskTypeValue.length === 0 ||
      ClassificationValue.length === 0 ||
      Comments.length === 0 ||
      !weekEndDate ||
      TaskDescription.length === 0
    ) {
      return;
    }
        const newCreateTask: Task = {
            employeeId: employeeId,
            uIUserStoryId: undefined,
            projectId: projectId,
            categoryId: CategoryId,
            uIId: 0,
            userStoryId: userStoryId,
            name: TaskName,
            estTime: parseInt(estTime),
            description: TaskDescription,
            status: status,
            percentage: 0,
            actTime: 0,
            startDate: undefined,
            endDate: undefined,
            weekEndingDate: weekEndDate,
            priority: '',
            Comment: Comments,
            EstimateStartDate: estStartDate,
            EstimateEndDate: estEndDate,
            taskType: TaskTypeValue,
            classification: ClassificationValue,
            selectedImages: selectedImages[0],
        }
        axios.privateAxios
            .post<string>("/app/Task/CreateTask", newCreateTask)
            .then((response) => {
                console.log(response.data) 
                selectedImages.forEach(async(file,index)=>{
                    let uploaded = await uploadImage(
                        file,
                        response.data.id
                      );
                })

                showMessage({
                    message: 'Task Created Successfully!',
                    type: 'success',
                    duration: 3000,
                    floating: true,
                    icon: () => (
                        <Ionicons name="checkmark-circle-outline" size={20} />
                    ),
                });
                navigation.navigate("Home")
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
            });
    };

    const uploadImage = async (
        file: File,
        id: number,
      ) => {
        debugger;
        const formData = new FormData();
        let filename = file.path.split("/").pop();
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename!);
        let type = match ? `image/${match[1]}` : `image`;
        let imageToUpload = {
          type: type,
          name: filename,
          uri: file.path,
        };
        formData.append("DocumentType", type);
        formData.append("File", imageToUpload);
        console.log(JSON.stringify(imageToUpload));
        formData.append("FileName", filename!);
        formData.append("TaskId" , id);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
    
        return axios.privateAxios.post("/app/Upload/UploadDocument", formData, config);
      };
    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };
    const handleEstTimeChange = (text: string) => {
        setEstTime(text);
    };

    const handleTextareaChange = (text: string) => {
        setComments(text);
    };
    const handleEstEndDateChange = (text: Date) => {
        setEstEndDate(text);
      };

    const handleTaskTypeSelect = (text: string) => {
        setTaskTypeValue(text);
    };

    const handleClassificationSelect = (text: string) => {
        setClassificationValue(text);
    };
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
                <Text style={styles.headingText}>Create Task</Text>
            </View>
            <View style={styles.bottomView}>
                <SafeAreaView>
                    <ProgressTrackerCard ></ProgressTrackerCard>

                </SafeAreaView>
                <Text style={styles.titleText}>Create Task For User Story</Text>
                {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons/Loading.json')}
                        autoPlay={true}
                        loop={false}
                        visible={loading}
                        style={styles.animation}
                    />
                )}
                    <ScrollView style={styles.inputContainer}>
                        <POInputField
                            label="Task Name"
                            value={TaskName}
                            onChangeText={setTaskName}
                            secureTextEntry={false} placeholder={''} NonEditablelabel={''}                        
                            />
                            {TaskName.length === 0 && <Text style={{ color: 'red',left:10 }}>{EstTimeerror}</Text>}
                        <POInputBoxField
                            label="Task Description"
                            value={TaskDescription}
                            onChangeText={setTaskDescription}
                            secureTextEntry={false}
                        />
                        {TaskDescription.length === 0 && <Text style={{ color: 'red',left:10 }}>{TaskDescriptionerror}</Text>}
                        <POInputField
                            label="Status"
                            placeholder="Status"
                            value={status}
                            onChangeText={setStatus}
                            secureTextEntry={false}
                            editable={false}
                            NonEditablelabel='Status'
                        />
                        <PODateTimePicker
                            label={'Estimation Start Date'}
                            placeholder='Estimation Start Date'
                            value={estStartDate}
                            onChangeText={setEstStartDate}
                            minimumDate={new Date()}
                        />
                        {!estStartDate && <Text style={{ color: 'red',left:10 }}>{StartDateerror}</Text>}
                        <PODateTimePicker
                            label={'Estimation End Date:'}
                            placeholder='Estimation End Date'
                            value={estEndDate}
                            onChangeText={setEstEndDate}
                            minimumDate={new Date(estStartDate)}
                        />
                        {!estEndDate  && <Text style={{ color: 'red',left:10 }}>{EndDateerror}</Text>}
                        {estEndDate && estEndDate < estStartDate && (
                            <Text style={{ color: 'red' }}>Estimation End Date Cannot Be Earlier than Start Date</Text>
                        )}
                        <POInputField
                            label={'Estimation Time'}
                            placeholder={'Estimation Time'}
                            value={estTime}
                            onChangeText={handleEstTimeChange}
                            secureTextEntry={false}
                            maxLength={3}
                            keyboardType='number-pad'
                        />
                        {estTime.length === 0 && <Text style={{ color: 'red',left:10 }}>{EstTimeerror}</Text>}
                        <DatePickerWeekEndingDate
                            label={'Week Ending Date'}
                            placeholder='Week Ending Date'
                            value={estEndDate}
                            onChangeText={setWeekEstEndDate}
                        />
                        {!weekEndDate && <Text style={{ color: 'red',left:10 }}>{weekEndDateerror}</Text>}
                        <DropDown
                            label="Task Type"
                            placeholder="Select an option"
                            data={TaskTypeOptions}
                            value={TaskTypeValue}
                            disable={false}
                            setValue={setTaskTypeValue}
                            onChange={handleTaskTypeSelect}
                        />
                        {TaskTypeValue.length === 0 && <Text style={{ color: 'red',left:10 }}>{tasktypeerror}</Text>}
                        <DropDown
                            label="Classification"
                            placeholder="Select an option"
                            data={ClassificationOptions}
                            value={ClassificationValue}
                            disable={false}
                            setValue={setClassificationValue}
                            onChange={handleClassificationSelect}
                        />
                        {ClassificationValue.length === 0 && <Text style={{ color: 'red',left:10 }}>{Classificationerror}</Text>}
                        <POInputBoxField
                            label={'Comments'}
                            placeholder={'Comments'}
                            value={Comments}
                            onChangeText={handleTextareaChange}
                            multiline={true}
                        />
                        {Comments.length === 0 && <Text style={{ color: 'red',bottom:20,left:10 }}>{Commentserror}</Text>}
                        <PosCapturePhoto
                       setImages={setSelectedImages}
                         imageLimit={1}
                         label={"Capturephoto"}
                         mandatory={false}
                         setImageCount={setImageCount1}
                          ></PosCapturePhoto>
                        <FloatingButton
                                title="Create Task"
                                variant='contained'
                                onPress={handleSubmit}
                                style={styles.popupButton}
                                titleStyle={styles.popupButtonText}
                                icon='arrow-right-bold-circle'
                            />
                    
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
    popupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    topView: {
        marginTop: 30,
        marginHorizontal: 24,
        backgroundColor: '#3A9EC2',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    textarea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        height: 100,
        marginBottom: 10,
    },
    popupButton: {
        backgroundColor: '#35A2C1',
        height: 40,
        borderRadius:15,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width:"80%",
        bottom:10
    },
    popupButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    popupButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

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
    headingText: {
        position: 'absolute',
        top: 10,
        textAlign: 'center',
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
    },
    bottomView: {
        flex: 9,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        marginTop: 20,
        borderTopRightRadius: 50,
        paddingBottom:70
    },
    titleText: {
        marginHorizontal: 26,
        marginVertical: 20,
        fontWeight: 'bold',
        fontSize: 20,
    },
    searchbar: {
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        width: "95%",
        height: 50,
        borderRadius: 30,
        marginBottom: 25,
        //bottom:50,
        left: 10
    },
    circle: {
        borderRadius: 25,
        height: 50,
        width: 50,
        backgroundColor: "#fff"
    },
    customCardContainer: {
        backgroundColor: 'gray',
        marginHorizontal: 24,
        marginTop: -40,
        padding: 30,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        bottom: 11
    },
    loginButton: {
        backgroundColor: '#35A2C1',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    animation: {
        position: 'absolute',
        width: '140%',
        height: '140%',
    },

});

export default AssignTaskScreen;
