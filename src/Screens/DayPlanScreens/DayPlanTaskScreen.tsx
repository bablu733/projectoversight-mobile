import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, SafeAreaView, Share } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../../Contexts/Axios';
import POTaskListItem from '../../Components/POTaskListItem';
import { TaskModel } from '../../Models/TaskModel';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import LottieAnimation from '../../Components/Animation';
import EmployeeProgressTracker from '../../Components/EmployeeProgressTracker';
import { Button } from 'react-native-paper';
import POButton from '../../Components/POButton';
import { Animated, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useFocusEffect } from '@react-navigation/native';
import FilterComponent from '../../Components/POFilter';import { Upload } from '../../Models/Upload';

//Navigation
type TaskListProps = NativeStackNavigationProp<EmployeeStackParamList, "DayPlanTaskDetails">;

//Route props
type TaskListRouteProps = RouteProp<EmployeeStackParamList, "DayPlanTaskScreen">;

const DayPlanTaskScreen: React.FC = () => {

  const axios = useAxios();
  const navigation = useNavigation<TaskListProps>();
  const route = useRoute<TaskListRouteProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<TaskModel[]>([]);
  
  const [originalList, setOriginalList] = React.useState<TaskModel[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const [selectedProjectId] = React.useState(route.params.ProjectId);
  const [ProjectName] = React.useState<string>(route.params.ProjectName);
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const animatedValue = React.useRef(new Animated.Value(1)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [status,setStatus] = React.useState<string[]>([]);

  React.useEffect(() => {
    debugger;
    loadConnectionList();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      debugger;
    loadConnectionList();
    }, [])
  );
  const animatedStyle = {
    transform: [{ translateX: shakeAnimation }]
  };
  const onSelect = async (data: TaskModel) => {
    debugger
    if (data.percentage === 100) {
      showMessage({
        message: 'Task Already Completed!',
        type: 'success',
        duration: 3000,
        floating: true,
    });
      return;
    } 
    else
    {
      navigation.navigate("DayPlanTaskDetails", { Id: data.id, Name: data.name, description: data.description, status: data.status, ProjectId: data.projectId, percentage: data.percentage, priority: data.priority, ProjectName: ProjectName,estimate: data.estTime });
    }

  }

  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        debugger;
        const Name = `${item.name.toUpperCase()}`;
        const Description = `${item.description}`;
        const textData = text.toUpperCase();
        return (
          Name.indexOf(textData) > -1 ||
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
  const GetFridaysOfMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const fridays: Date[] = [];
    const dateIterator = new Date(currentDate.getFullYear(), currentMonth, 1);
  
    while (dateIterator.getMonth() === currentMonth) {
      if (dateIterator.getDay() === 5) {
        fridays.push(new Date(dateIterator));
      }
      dateIterator.setDate(dateIterator.getDate() + 1);
    }
    const ConvertDate = (date) => {
      if (!date) return "-";
      const convertedDate = new Date(date);
      const year = convertedDate.getFullYear();
      const month = String(convertedDate.getMonth() + 1).padStart(2, '0');
      const day = String(convertedDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const convertedFridays = fridays.map((date) => ConvertDate(date.toISOString()));
    const WeekEndingDateDropDown = convertedFridays;
    return WeekEndingDateDropDown;
  }; 
  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleFilterChange = (status: string[], estStartDate: string, weekEndDate: string[]) => {
    debugger;
    const filteredList = originalList.filter((item) => {
      const matchesStatus = !status.length || status.includes(item.status);
      const estStartDateString = item.createdDate.toString().split("T")[0];
      const matchesEstStartDate = !estStartDate || estStartDateString === estStartDate;
      const matchesWeekEndDate = !weekEndDate.length || weekEndDate.some(date => date === item.weekEndingDate.toString().split("T")[0]);
      return matchesStatus && matchesEstStartDate && matchesWeekEndDate;
    });
    setList(filteredList);
  };
  const loadConnectionList = async () => {
    debugger;
    setLoading(true);
    setTimeout(() => {
      axios.privateAxios
        .get<TaskModel[]>("/app/EmployeeTask/GetProjectTasklist?Id=" + selectedProjectId)
        .then((response) => {
          debugger;
          setLoading(false);
          setList(response.data);
          setOriginalList(response.data);
          const StatusSet = new Set();
        response.data.forEach((item) => {
            StatusSet.add(item.status);
        });
        const statusArray = Array.from(StatusSet);
        setStatus(statusArray)
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response.data);
        });
    }, 1000);
  };
 
  const OpenSendTaskPopUp = (data: TaskModel[]) => {
    navigation.navigate("WhatsappTaskList", { ProjectTask: data });
  }
  return (
    <>
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

          <Text style={styles.headingText}>Employee Task List</Text>
        </View>
        <View style={styles.searchBarContainer}>
        <View style={styles.searchbar}>
          <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
          <TextInput placeholder="Search" onChangeText={(text) => searchFunction(text)}
            value={searchvalue} style={styles.searchInput} />
            <FilterComponent  onFilterChange={true} weekEndingDate={GetFridaysOfMonth()} Status={status} onSubmit={handleFilterChange}></FilterComponent>
        </View>
        </View>
        <View style={styles.bottomView}>
          <SafeAreaView>
            <EmployeeProgressTracker></EmployeeProgressTracker>

          </SafeAreaView>
          <Text style={styles.titleText}>Choose Task</Text>
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
              <POTaskListItem
                Name={item.name}
                Description={item.description}
                Status={item.status}
                percentage={item.percentage}
                            TaskType={item.taskType}
                onPress={() => onSelect(item)}
              ></POTaskListItem>

              )}
            />
            {/* <Animated.View style={[styles.whatsappButton, animatedStyle]}>
              <TouchableOpacity activeOpacity={1} onPress={() => OpenSendTaskPopUp(list)}>
                <FontAwesome name="whatsapp" size={30} color="#fff" />
              </TouchableOpacity>
            </Animated.View> */}
            <View>
            </View>
            </View>  
        </View>
        </>
    );
};

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
        flexDirection: 'row',
    },
    headingText: {
        marginRight:50,
        top: 5,
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
        paddingBottom:80
    },
    title: {
        marginHorizontal: 26,
        marginVertical: 16,
        fontWeight: 'bold',
        fontSize: 20,
    },
    searchbar: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'center',
      flex: 1, // Take all available space on the left side
      height: '65%',
      borderRadius: 30,
      paddingRight: 5,
    },
    ProfileIcon: {
        width: 40,
        transform: [{ rotateY: '180deg' }]
    },
    searchInput: {
      color: '#BEBEBE',
      flex: 1, // Take all available space on the left side after the icon
      marginLeft: 20,
      opacity: 0.5,
      fontSize: 20,
    },
    titleText: {
        marginHorizontal: 26,
        marginVertical: 20,
        fontWeight: 'bold',
        fontSize: 20,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft:20,
        marginTop:10,
      },
      backButton: {
        left:-5,
        top:4,
      },
      animation: {
        position: 'absolute',
        width: '140%',
        height: '140%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed (0.5 represents 50% opacity)
      },
      popupContainer: {
        position: 'absolute',
        bottom: 60,
        right: 0, // Updated to show on the right side
        width: '50%',
        height: '90%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        borderBottomLeftRadius: 16,
      },
      closeButton: {
        alignSelf: 'flex-end',
      },
      option: {
        paddingVertical: 10,
        borderBottomWidth: 1,
      },
      whatsappButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
      },
      searchBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        height: 80, // Increase the height to accommodate multiple lines
        borderRadius: 30,
        marginBottom: 3,
        marginLeft:10,
        flexWrap: 'wrap', // Allow content to wrap to the next line
      },
});

export default DayPlanTaskScreen;
