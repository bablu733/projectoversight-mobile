import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeStackParamList } from '../Routes/EmployeeStack';
import { useAuth } from '../Contexts/Auth';
import POInputBoxField from '../Components/POInputBoxField';
import POButton from '../Components/POButton';
import { useAxios } from '../Contexts/Axios';
import { LoginDetails } from '../Models/Login/LoginDetails';
import { Table, Row, Rows } from 'react-native-table-component';
import moment from 'moment';
import { RadioButton } from 'react-native-paper';
import POLocation from '../Components/POLocation';
import * as Location from 'expo-location';
import {Snackbar} from 'react-native-paper';
import FlashMessage, { showMessage } from 'react-native-flash-message';

type HomeScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Home">;
const EmployeeTimeScreen: React.FC = () => {
  const auth = useAuth();
  const axios = useAxios();
  const navigation = useNavigation<HomeScreenProp>();
  const [LoginComment, setLoginComment] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<LoginDetails[]>([]);
  const [selectedOption, setSelectedOption] = useState('true');
  const [InTime, setInTime] = useState(false);
  const [OutTime, setOutTime] = useState(false);
  const employeeId = auth.loginData.employeeId;
  const [lastRecordId, setLastRecordId] = useState();
  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLongitude] = useState(Number);

  
  const saveLoginDetail = async () => {
    debugger
    if (!isFormValid()) {
      return;
    }
    let LoginDetails: LoginDetails;
    if (selectedOption === 'true' && InTime === false) {
      debugger
      LoginDetails = {
        Id: undefined,
        InTime: new Date(),
        OutTime: null,
        Comments: LoginComment,
        Latitude: latitude,
        Longitude: longitude,
      }
    }
    else {
      LoginDetails = {
        Id: lastRecordId,
        InTime: null,
        OutTime: new Date(),
        Comments: LoginComment,
        Latitude: latitude,
        Longitude: longitude,
      }
    }

    setLoading(true);
    await axios.privateAxios
      .post<LoginDetails>(
        "app/EmployeeTime/AddEmployeeTimeDetails",
        LoginDetails
      )
      .then((response) => {
        debugger
        console.log(response);
        console.log(response.data);
        setLoading(false);
        showMessage({
          message: 'Details Added Successfully',
          type: 'success',
          duration: 3000,
          floating: true,
        });
        getEmployeeLoginDetails();
        setLoginComment("");
        navigation.navigate('Home')
        
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
      });

  }
  const isFormValid = () => {
    if (LoginComment === "") {
      setError(("Enter Comments"));
      //isLoading(false);
      return false;
    }
    return true;
  }

  const getEmployeeLoginDetails = async () => {
    setLoading(true);
    await axios.privateAxios
      .get<LoginDetails[]>("/app/EmployeeTime/GetEmployeeTimeDetails")
      .then((response) => {
        debugger;
        setLoading(false);
        setList(response.data);
        if (response.data.length === 0) {
          setOutTime(true);
          setInTime(false);
        }
        else if (response.data.length > 0) {
          const lastRecord = response.data[response.data.length - 1];
          if (lastRecord.outTime === null) {
            setInTime(true);
            setOutTime(false);
            setLastRecordId(lastRecord.id);
          } else {
            setInTime(false);
            setOutTime(true);
          }
        }
        else {
          setInTime(true);
          setOutTime(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
  }
  const userLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      //setErrorMsg('Permission to access location was denied');
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      //setErrorMsg('Error getting location: ' + error.message);
    }
  };
  useEffect(() => {
    getEmployeeLoginDetails();
    userLocation();
  }, []);

  return (
    <View style={styles.container}>
      <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
      <View style={styles.topView}>
        {/* <Ionicons
            name="chevron-back"
            size={30}
            color="#fff"
            style={styles.backButton}
            onPress={()=>navigation.navigate('Home')}
          /> */}
        <Text style={styles.headingText}>My Login Time</Text>
       
      </View>
      <POLocation />
      <View style={styles.bottomView}>
        <ScrollView>
          <View style={styles.modalContent1}>
            <Text style={styles.optionText1}>Your Login Time</Text>
            <View>
              <RadioButton.Group onValueChange={value => setSelectedOption(value)} value={selectedOption}>
                <View>
                  <Text>InTime</Text>
                  <RadioButton value={selectedOption} disabled={InTime} />
                </View>
                <View>
                  <Text>OutTime</Text>
                  <RadioButton value={selectedOption} disabled={OutTime} />
                </View>
              </RadioButton.Group>
              <Table borderStyle={styles.tableBorder}>
                <Row data={['In Time', 'OutTime', 'Comments']} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                <Rows
                  data={list ? list.map((item, index) => [
                    item.inTime ? moment(item.inTime).format('DD/MM/YYYY HH:mm') : '-',
                    item.outTime ? moment(item.outTime).format('DD/MM/YYYY HH:mm') : '-',
                    item.comments
                  ]) : []}
                  textStyle={styles.tableRowText}
                />
              </Table>
            </View>
            <View style={{ marginTop: 10 }}>
              <POInputBoxField
                label={"Comments"}
                placeholder={""}
                value={LoginComment}
                onChangeText={setLoginComment}
                numberOfLines={4}
                multiline={true}
                secureTextEntry={false}
                keyboardType={"ascii-capable"}
                maxLength={50}
                editable={true}
                autoFocus={false}
                mandatory={false}
              ></POInputBoxField>
            </View>
            <POButton
              title="Save"
              onPress={saveLoginDetail}
              style={styles.loginButton}
              titleStyle={styles.buttonText}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
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
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  title: {
    marginHorizontal: 26,
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 26,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 10,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  tableHeaderText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableRowText: {
    margin: 6,
    textAlign: 'center',
    fontSize: 14,
    color: 'black',
  },
  commentsContainer: {
    marginTop: 10,
    margin: 20,
  },
  saveButton: {
    backgroundColor: '#35A2C1',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    margin: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  locationContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    width: "100%"
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 4,
  },
  modalContent1: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  optionText1: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold'
  },
  loginButton: {
    backgroundColor: '#35A2C1',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    bottom: 15
  },
  backButton: {
    position: 'absolute',
    left: 0,
    bottom: 0
  },
});

export default EmployeeTimeScreen;
