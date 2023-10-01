import React from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProjectListItem from '../../Components/ProjectListItem';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';

type TaskScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Task">;
type TaskProp = RouteProp<EmployeeStackParamList, "Task">;
const TaskScreen: React.FC = () => {

  const axios = useAxios();
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<Project[]>([]);
  const [originalList, setOriginalList] = React.useState<Project[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");


  const navigation = useNavigation<TaskScreenProp>();
  const route = useRoute();
  const params = route.params;

  const handlePress = async (data :Project) => {
    navigation.navigate("Category",{ProjectId:data.id ,Name: data.name})
  };
  const handleBackPress = () => {
    navigation.goBack();
  };
  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Type = `${item.type}`;
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
        .get<Project[]>("/app/Project/GetEmployeeProjectlist")
        .then((response) => {
          setLoading(false);
          setList(response.data);
          console.log(response.data);
          setOriginalList(response.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response.data);
        });
    }, 1000);
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

        <Text style={styles.headingText}>Task</Text>
      </View>
      <View style={styles.searchbar}>
        <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
        <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue}  onChangeText={(text) => searchFunction(text)} />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.titleText}>Choose Projects</Text>
        {loading ? (
          <LottieAnimation
            source={require('../../../assets/icons/Loading.json')}
            autoPlay={true}
            loop={true}
            visible={loading}
          />
        ) : (
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <POProjectListItem
                Name={item.name}
                Type={item.type}
                Description={item.description}
                percentage={item.percentage}
                onPress={() => handlePress(item)}
              ></POProjectListItem>
            )}
          />
        )}
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
    marginBottom:10
  },
  bottomView: {
    flex: 6,
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
    left: 10
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
    top:1,
  },
  animation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
},
});

export default TaskScreen;
