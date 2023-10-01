import React from 'react';
import { View, Text, StyleSheet, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import POButton from '../Components/POButton';
import { useAxios } from '../Contexts/Axios';
import { PasswordRequest } from '../Models/Login/PasswordRequest';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../Routes/AuthStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type LoginScreenProp = NativeStackNavigationProp<AuthStackParamList, "EmployeeLogin">;

const NewPasswordScreen: React.FC = () => {
    const axios = useAxios();
    const [newPassword, setNewPassword] = React.useState<string>("");
    const [confirmPW, setConfirmPW] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const navigation = useNavigation<LoginScreenProp>();

    const back = async () => {
        navigation.navigate("EmployeeLogin");
    };

    const isPWFormValid = () => {
        if (email === "") {
            setError("Please enter your email");
            //isLoading(false);
            return false;
        }
        return true;
    };

    const isFPFormValid = () => {
        if (newPassword === "") {
            setError("Enter New Password");
            return false;
        } else if (confirmPW === "") {
            setError("Enter Confirm Password");
            return false;
        }
        return true;
    };

    const isFormValid = () => {
        if (newPassword !== confirmPW) {
            setError("Entered Password Mismatch");
            return false;
        }
        return true;
    };

    const isLengthValid = () => {
        if (newPassword.length < 6 || newPassword.length > 12 || confirmPW.length < 6 || confirmPW.length > 12) {
            setError("Password must be between 6 and 12 characters");
            return false;
        }
        return true;
    };

    const Save = async () => {
        setError("");

        if (!isPWFormValid()) {
            //  isLoading(false);
            return;
        }

        if (!isFPFormValid()) {
            return;
        }

        if (!isFormValid()) {
            return;
        }

        if (!isLengthValid()) {
            return;
        }

        const passwordSave: PasswordRequest = {
            Email: email,
            Password: newPassword,
            ConfirmPassword: confirmPW
        };

        axios.publicAxios
            .post<PasswordRequest>("/Auth/ChangePW", passwordSave)
            .then((response) => {
                console.log(response.data);
                //setError(response.data);
                back();
            })
            .catch((error) => {
                // setLoading(false);
                setError(error.response.data);
            });
    };

    return (
        <LinearGradient
            colors={['white', '#3A9EC2']}
            start={[0, 1]}
            end={[1, 0]}
            style={styles.gradient}
        >
            <View style={styles.content}>
                <View style={styles.keyContainer}>
                    <Text style={styles.keySymbol}>🔑</Text>
                </View>
                <Text style={styles.title}>Create New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder={"Email"}
                    value={email}
                    onChangeText={setEmail}
                    secureTextEntry={false}
                    keyboardType={"ascii-capable"}
                    maxLength={40}
                    autoFocus={true}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={true}
                    keyboardType={"ascii-capable"}
                    maxLength={20}
                    autoFocus={false}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter Confirm Password"
                    value={confirmPW}
                    onChangeText={setConfirmPW}
                    secureTextEntry={true}
                    keyboardType={"ascii-capable"}
                    maxLength={10}
                    autoFocus={false}
                />

                <Text style={{ color: 'red', margin: 5 }}>{error}</Text>

                <View style={styles.buttonContainer}>
                    <POButton
                        title={"Save"}
                        onPress={Save}
                    />

                    <POButton
                        title={"Cancel"}
                        onPress={back}
                    />
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    keyContainer: {
        marginBottom: 20,
    },
    keySymbol: {
        fontSize: 80,
        color: 'white',
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
    },
    input: {
        width: 300,
        height: 40,
        borderRadius: 5,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        marginTop: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingHorizontal: 40,
    },
});

export default NewPasswordScreen;
