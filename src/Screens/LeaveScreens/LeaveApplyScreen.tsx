import React, { useEffect,useState } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, Modal,ScrollView, Button, TouchableOpacity,KeyboardAvoidingView,SafeAreaView, Vibration } from 'react-native';
import { useNavigation, useRoute,RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import POInputField from '../../Components/POSInputField';
import POButton from '../../Components/POButton';
import { useAxios } from '../../Contexts/Axios';
import {Status} from '../../Constants/Status'
import { Task } from '../../Models/Task';
import { useAuth } from '../../Contexts/Auth';
import TaskDetailsPopup from '../../Components/CreateTaskPopup';
import POInputBoxField from '../../Components/POInputBoxField';
import ProgressTrackerCard from '../../Components/ProgressTrackerCard';
import LottieAnimation from '../../Components/Animation';
import PODateTimePicker from '../../Components/PODateTimePicker';
import PODropDown from '../../Components/PODropDown';
import { EmployeeLeave } from '../../Models/EmployeeLeave';


//Navigation
type AssignScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "LeaveApplyScreen">;

//Props
type TaskListRouteProps = RouteProp<EmployeeStackParamList, "LeaveApplyScreen">;

const LeaveApplyScreen: React.FC = () => {
    const axios = useAxios();
    const navigation = useNavigation<AssignScreenProp>();
    const route = useRoute<TaskListRouteProps>();
    const auth = useAuth();
  
    const [loading, setLoading] = React.useState(false);
    const [UserName, setUserName] = React.useState<string>("");
    const [description, setDesciption] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [status, setStatus] = React.useState<string>(Status.Pending);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [error,setError]=React.useState<string>();
    const [fromDate, setFromDate] = React.useState('');
    const [toDate, setToDate] = React.useState('');
    const employeeId = auth.loginData.employeeId;
    const [estTime, setEstTime] = useState<Date>();
    const [estStartDate, setEstStartDate] = useState<Date>(new Date());
    const [estEndDate, setEstEndDate] = useState<Date>();
    const [selectedCategoryValue, setSelectedCategoryValue] = useState('');
    const isEmergencyLeaveApplicable = (): boolean => {
        if(selectedCategoryValue == 'Emergency Leave')
      {
        return true;
      }
    else {
        return  false;
      };
    }
    const handleFromDateChange = (date) => {
        setFromDate(date);
      };
    
      const handleToDateChange = (date) => {
        setToDate(date);
      };
    const renderButton = () => {
        if (isEmergencyLeaveApplicable()) {
          return (
            <POInputField
                  label={' Start Date'}
                  placeholder=' Start Date'
                  value={estStartDate.toString()}
                  onChangeText={undefined}
                  editable={false} secureTextEntry={false} NonEditablelabel={''}           
          />
         
          );
        } else  {
          return (
            <>
           <PODateTimePicker
            label={' Start Date'}
            placeholder=' Start Date'
            value={fromDate}
            onChangeText={handleFromDateChange}
            minimumDate={new Date()}
          />
            <PODateTimePicker
            label={'End Date'}
            placeholder='End Date'
            value={toDate}
            onChangeText={handleToDateChange}
            minimumDate={new Date()}
          /> 
          </>
          );
        } 
      };
      const fetchApplyLeave = async () => {
        debugger
        try {
          setLoading(true);
          const response = await axios.privateAxios.get<EmployeeLeave[]>("/app/EmployeeLeave/GetEmployeeLeavelist");
            console.log(response)
          
        } catch (error) {
          setLoading(false);
          console.log(error.response.data);
        }
      }
      useEffect(() => {
        fetchApplyLeave();
      }, []);
    const isFormValid = () => {
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
     const leaveCategory = [
            { label: "Sick Leave", value: "Sick Leave" },
            { label: "Emergency Leave", value: "Emergency Leave" },
            { label: "CompOff Leave", value: "CompOff Leave" },
            { label: "Earned Leave", value: "Earned Leave" },
            { label: "Casual Leave", value: "Casual Leave" },
            { label: "Accident/Injury Leave", value: "Accident/Injury Leave" },
     ]
    const handleSubmit = (  ) => {
        if (!isFormValid()) {
            return;
          }
          const newApplyLeave : EmployeeLeave ={
              EmployeeId: employeeId,
              FromDate: estStartDate,
              ToDate: estEndDate,
              Description: description,
              Status: status
          }
    axios.privateAxios.post<string>("/app/EmployeeLeave/CreateEmployeeLeave",newApplyLeave )
      .then((response) => {
        console.log(response.data);
            navigation.navigate("Home");
        })
      .catch((error) => {
        console.log(error.response.data)
      })
    };
  
   
    return (
        <View style={styles.container}>

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
                <Text style={styles.headingText}>Apply Leave</Text>
            </View>
           
            <View style={styles.bottomView}>
            <SafeAreaView>
  
      
  </SafeAreaView>
                <Text style={styles.titleText}>Apply Leave Details</Text>
                <ScrollView>
                    <View style={styles.inputContainer}>
                    <PODropDown
          title="Category"
          placeholder="Select an option"
          data={leaveCategory}
          value={selectedCategoryValue}
          disable={false}
          setValue={setSelectedCategoryValue}
          onChange={undefined}
        />
        
           <View>
          {renderButton()}
        </View>
          
                        <POInputField
                            label="Description"
                            placeholder="Description"
                            value={description}
                            onChangeText={setDesciption}
                            secureTextEntry={false}
                            editable={true}
                            NonEditablelabel='Description'
                              />
                               <POInputField
                            label="Status"
                            placeholder="Status"
                            value={"Pending"}
                            onChangeText={setStatus}
                            secureTextEntry={false}
                            editable={false}
                            NonEditablelabel='Status'/>
                        <POButton
                            title="Apply Leave"
                            onPress={handleSubmit}
                            style={styles.loginButton}
                            titleStyle={styles.buttonText}
                        />
                 
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
        flex:2,
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
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
        marginRight: 10,
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
        borderRadius:15,
        padding: 50,
        marginHorizontal: 20,
        alignSelf: 'stretch',
        height:500,
        width:"90%"
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
        flex:11,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
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
        paddingHorizontal: 20,
        bottom:-10
    },
    backButton: {
        position: 'absolute',
        left: 0,
        bottom:9
    },
    loginButton: {
        backgroundColor: '#35A2C1',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        bottom:20,
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

export default LeaveApplyScreen;
