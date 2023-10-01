import * as React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAxios } from '../../Contexts/Axios';
import { Project } from '../../Models/Project';
import POProjectListItem from '../../Components/POProjectListItem';
import LottieAnimation from '../../Components/Animation';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { Task } from '../../Models/Task';

type MyTaskScreenBasedonprojectProp = NativeStackNavigationProp<EmployeeStackParamList, "MyTask">;
type MyTaskProp = RouteProp<EmployeeStackParamList, "MyTaskBasedOnproject">;

const MyTaskListBasedonproject: React.FC = () => {
  const navigation = useNavigation<MyTaskScreenBasedonprojectProp>();
  const axios = useAxios();
  const route = useRoute<MyTaskProp>();
  const [list, setList] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [originalList, setOriginalList] = React.useState<Task[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  const [projectid] = React.useState(route.params.ProjectId);

  const loadConnectionList = async () => {
    setLoading(true);
    setTimeout(() => {
      axios.privateAxios
        .get<Task[]>("/app/Common/GetProjectTaskList?ProjectId=" + projectid)
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

  const handleBackPress = () => {
    navigation.goBack();
  };

  const searchFunction = async (text: string) => {
    if (text) {
      const updatedData = originalList.filter((item) => {
        const Name = `${item.name.toUpperCase()}`;
        const Type = `${item.name}`;
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

        <Text style={styles.headingText}>My Task List</Text>

        <View style={styles.searchbar}>
          <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
          <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue} onChangeText={(text) => searchFunction(text)} />
        </View>

      </View>
      <View style={styles.bottomView}>
        <Text style={styles.title}>Task List</Text>
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
                Type={item.taskType}
                Description={item.description}
                percentage={item.percentage}
                onPress={() => navigation.navigate("TaskDetailsScreen", { task: item })}
              />
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
    paddingBottom: 50,
  },
  title: {
    marginHorizontal: 26,
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 20,
  },
  searchbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    width: "95%",
    height: 40,
    borderRadius: 30,
    marginTop: 50,
    left: 8,
  },
  ProfileIcon: {
    width: 40,
    transform: [{ rotateY: '180deg' }],
  },
  searchInput: {
    color: "#BEBEBE",
    marginLeft: 15,
    opacity: 0.5,
    fontSize: 20,
  },

  backButton: {
    position: 'absolute',
    left: 0,
    bottom: 25,
  },
  listView: {
    marginTop: 1,
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
});

export default MyTaskListBasedonproject;
