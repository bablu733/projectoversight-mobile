import React from 'react';
import { View, StyleSheet, Text ,TextInput,FlatList, TouchableOpacity,Modal, KeyboardAvoidingView,SafeAreaView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAxios } from '../../Contexts/Axios';
import POProjectListItem from '../../Components/POProjectListItem';
import { UserInterface } from '../../Models/UserInterfaceModel';
import TaskDetailsPopup from '../../Components/CreateTaskPopup';
import { useAuth } from '../../Contexts/Auth';
import { Task } from '../../Models/Task';
import { Status } from '../../Constants/Status';
import ProgressTrackerCard from '../../Components/ProgressTrackerCard';
import LottieAnimation from '../../Components/Animation';


type UIListScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "UIList">;
type UIListProp = RouteProp<EmployeeStackParamList, "UIList">;


const UIlistScreen: React.FC = () => {
const axios = useAxios();
const auth = useAuth();
const [loading, setLoading] = React.useState(false);
const [list, setList] = React.useState<UserInterface[]>([]);
  const navigation = useNavigation<UIListScreenProp>();
  const route = useRoute<UIListProp>();
  const [projectId] = React.useState(route.params.ProjectId)
  //const [isUSApplicable] = React.useState(route.params.isUSApplicable);
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const [Name] = React.useState<string>(route.params.Name);
  const [categoryId] = React.useState(route.params.CategoryIds);
  const [UserName, setUserName] = React.useState<string>("");
  const [description, setDesciption] = React.useState<string>("");
  const employeeId = auth.loginData.employeeId;
  const [estTime, setEstTime] = React.useState('');
  const [error,setError]=React.useState<string>();
  const [status, setStatus] = React.useState<string>('Pending');
  const [UIId, setUIId] = React.useState<number>(0);
  const [UserStoryId] = React.useState<number>(route.params.UserStoryId);
  const [CategoryName] = React.useState<string>(route.params.CategoryName);
  const [SubCategoryName] = React.useState<string>(route.params.subCategoryName);
  const [USName] = React.useState<string>(route.params.USName);
  const [originalList, setOriginalList] = React.useState<UserInterface[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");

  const handlePress = async (uIId: number, data: UserInterface) => {
      navigation.navigate("UICreateTask", {
        userInterfaceId: uIId,
        projectId: projectId,
        CategoryIds: categoryId,
        UIName: data.name,
        Description: data.description,
        UserStoryId:UserStoryId,
        CategoryName:CategoryName,
        subCategoryName:SubCategoryName,
        Name:Name,
        USName:USName,
      });
    setUIId(uIId);
  };
  
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };
  const handleBackPress = () => {
    navigation.goBack();
  };
  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Type = `${item.status}`;
        const Description = `${item.description}`;
        const textData = text.toUpperCase();
        return (
          Name.indexOf(textData) > -1 ||
          Type.indexOf(textData) > -1 ||
          Description.indexOf(text) > -1
        );
      });
      setList(updatedData);
      setSearchValue(text);
    } else {
      setList(originalList);
      setSearchValue("");
    }
  };

  const loadConnectionList = async () => {
    setLoading(true);
    setTimeout(() => {
    axios.privateAxios
      .get<UserInterface[]>("/app/Task/GetUserInterfacelist?UserStoryId="+ UserStoryId )
      .then((response) => {
        setLoading(false);
        setList(response.data);
        setOriginalList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
    }, 1000);
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
  const handleSubmit = (estStartDate: Date, estTime: string, comments: string , estEndDate:Date) => {
    setLoading(true);
    if (!isFormValid()) {
        return;
      }
      const newCreateTask : Task ={
        employeeId:employeeId,
        uIUserStoryId: undefined,
        projectId: projectId,
        categoryId: categoryId,
        uIId:UIId,
        userStoryId:undefined,
        name: UserName,
        estTime: parseInt(estTime),
        description: description,
        status: status,
        percentage: 0,
        actTime: 0,
        startDate: undefined,
        endDate: undefined,
        weekEndingDate: undefined,
        priority: '',
        Comment:comments,
        EstimateStartDate:estStartDate,
        EstimateEndDate:estEndDate,
    }
axios.privateAxios.post<string>("/app/Task/CreateTask",newCreateTask )
  .then((response) => {
    console.log(response.data)
    setLoading(false);
    navigation.navigate("Home")
  })
  .catch((error) => {
    setLoading(false);
    console.log(error.response.data)
  });
};

  React.useEffect(() => {
    loadConnectionList();
  }, []);

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
        
        <Text style={styles.headingText}>UI List</Text>
      </View>
      <View style={styles.searchbar}>
            <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue} onChangeText={(text) => searchFunction(text)} />
          </View>
      <View style={styles.bottomView}>
      <SafeAreaView>
    <ProgressTrackerCard></ProgressTrackerCard>
      
  </SafeAreaView>
        <Text style={styles.titleText}>Choose UI Screens</Text>
        {loading && (
                    <LottieAnimation
                        source={require('../../../assets/icons/Loading.json')}
                        autoPlay={true}
                        loop={false}
                        visible={loading}
                    />
                )}
        <FlatList
          data={list}
          renderItem={({ item }) => (
            <POProjectListItem
              Name={item.name}
              Type={item.status}
              Description={item.description}
              percentage={item.percentage}
              onPress={() => handlePress(item.id,item)}
            ></POProjectListItem>

          )}
        />
        {/* <TaskDetailsPopup
          isVisible={isPopupVisible}
          onClose={handleClosePopup}
          onSubmit={handleSubmit}
        /> */}
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
    marginTop:30,
    marginHorizontal: 24,
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    marginRight:50,
    top: 10,
    textAlign: 'center',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex:6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    marginTop: 20,
    borderTopRightRadius: 50,
    paddingBottom:80,
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
    left:10
  },
  circle: {
    borderRadius: 25,
    height: 50,
    width: 50,
    backgroundColor: "#fff"
  },
  ProfileIcon: {
    width: 40,
    transform: [{ rotateY: '180deg' }]
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: 15,
    opacity: 0.5,
    fontSize: 20
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
  backButton: {
    left:-35,
    top:5,
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
  width: '90%',
},
popupTitle: {
  fontSize: 18,
  fontWeight: 'bold',
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
heading: {
  fontWeight: 'bold',
  fontSize: 20,
  marginLeft:20,
  marginTop:10,
},
animation: {
  position: 'absolute',
  width: '140%',
  height: '140%',
},
});

export default UIlistScreen;
