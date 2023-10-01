import * as React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginRequest } from './Models/Login/LoginRequest';
import { useAuth } from "../src/Contexts/Auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from './Routes/AuthStack';
import POSInputField from './Components/POSInputField';
import POButton from './Components/POButton';
import LottieAnimation from './Components/Animation';
import MainAnimation from './Components/MainScreenLoading';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import info from "expo-constants"
import { Constants } from './Constants/Constants';


type LoginScreenProp = NativeStackNavigationProp<AuthStackParamList, "EmployeeLogin">;
const LoginScreen: React.FC = () => {
  const [error, setError] = React.useState<string>("");
  const [loading, isLoading] = React.useState(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setpassword] = React.useState<string>("");
  const auth = useAuth();
  const navigation = useNavigation<LoginScreenProp>();
  const Loading  = auth.loading;
  const Error = auth.error;
  const version = info.manifest?.version
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  
  const handleLogin = async () => {
    debugger;
    setError("");
    isLoading(true);
    if (!isFormValid()) {
      return;
    }
    const loginRequest: LoginRequest = {
      Email: email,
      Password: password,
      versionCode:version
    };
   auth.signIn(loginRequest);
  };
  const isFormValid = () => {
    debugger;
    if(email === ""){
      setError("Please enter your email");
      isLoading(false);
      return false;
    }
    else if(password === "") {
      setError("Please enter your password");
      isLoading(false);
      return false;
    }
   return true;
     
  };
  const handleForgotPassword = () => {
    navigation.navigate("NewPassword");
  };
  return (
    <View style={styles.container}>
       <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
      {Loading && (
                    <MainAnimation
                        source={require('../assets/icons/Loading.json')}
                        autoPlay={true}
                        loop={false}
                        visible={Loading}
                        style={styles.animation}
                    />
                )}
      <View style={styles.topview}>
        <View style={styles.welcomecontainer}>
          <Text style={styles.welcomemessage}>
            Hello, Welcome To Project Oversight
          </Text>
        </View>
      </View>
      <View style={styles.bottomview}>
        <Text style={styles.optionText}>Login / SignUp</Text>
        <View style={styles.inputContainer}>
        <POSInputField
        label={"Email"}
        placeholder={"Email"}
        value={email}
        onChangeText={setEmail}
        secureTextEntry={false}
        keyboardType={"ascii-capable"}
        maxLength={40}
        autoFocus={false}
        icon={"mail"}
      ></POSInputField>
          <POSInputField
        label={"Password"}
        placeholder={"Password"}
        value={password}
        onChangeText={setpassword}
        secureTextEntry={true}
        keyboardType={"default"}
        autoFocus={false}
        icon={'eye'}
      ></POSInputField>
       <Text>{error}</Text>
       <Text>{Error}</Text>
        <POButton
        title="Login"
        onPress={handleLogin}
        style={styles.loginButton}
        titleStyle={styles.buttonText}
        />
          <View style={styles.bottomOptions}>
            <TouchableOpacity style={styles.bottomOptionButton} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.bottomOptionText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomOptionButton} onPress={handleForgotPassword}>
              <Text style={styles.bottomOptionText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.option}>Version-1.0.6</Text>
          <Text style={styles.option}>{Constants.Base_Type}</Text>
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topview: {
    marginTop: 60,
    marginHorizontal: 24,
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'space-between',
  },
  welcomemessage: {
    color: '#fff',
    fontSize: 35,
    fontWeight: 'bold',
  },
  welcomecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomview: {
    flex: 4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  optionText: {
    marginHorizontal: 26,
    marginVertical: 20,
    fontWeight: 'bold',
    fontSize: 20,
  },
  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  inputField: {
    backgroundColor: '#F7F7F7',
    height: 40,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
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
  bottomOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomOptionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomOptionText: {
    color: '#35A2C1',
    fontSize: 15,
  },
  animation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
},
option: {
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},
});

export default LoginScreen;
