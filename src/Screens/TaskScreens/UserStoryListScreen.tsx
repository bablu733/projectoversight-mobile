import React from 'react';
import { View, StyleSheet, Text ,TextInput,FlatList, TouchableOpacity,Modal, KeyboardAvoidingView ,SafeAreaView} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAxios } from '../../Contexts/Axios';
import POProjectListItem from '../../Components/POProjectListItem';
import { UserStory } from '../../Models/UserStoryModel';
import ProgressTrackerCard from '../../Components/ProgressTrackerCard';
import LottieAnimation from '../../Components/Animation';
import FlashMessage, { showMessage } from 'react-native-flash-message';


type USListScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "USList">;
type UsListProp = RouteProp<EmployeeStackParamList, "USList">;
const USlistScreen: React.FC = () => {
  const axios = useAxios();
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<UserStory[]>([]);
  const navigation = useNavigation<USListScreenProp>();
  const route = useRoute<UsListProp>();
  const [projectId] = React.useState(route.params.ProjectId);
  const [Name] = React.useState<string>(route.params.Name);
  const [CategoryId] = React.useState<number>(route.params.CategoryIds);
  const [isUIApplicable] = React.useState<boolean>(route.params.isUIApplicable);
  const [CategoryName] = React.useState<string>(route.params.CategoryName);
  const [SubCategoryName] = React.useState<string>(route.params.subCategoryName);
  const [originalList, setOriginalList] = React.useState<UserStory[]>([]);
  const [searchvalue, setSearchValue] = React.useState<string>("");
  
  const onSelect = async (data: UserStory) => {
    if (isUIApplicable == true) {
      navigation.navigate("UIList", { ProjectId: projectId, Name: Name, CategoryIds:CategoryId,UserStoryId:data.id,USName:data.name,CategoryName:CategoryName,subCategoryName:SubCategoryName  });
    } else {
      navigation.navigate("Assign", {
        userStoryId:data.id,
        projectId: projectId,
        CategoryIds: CategoryId,
        USName: data.name,
        Description: data.description,
        Name:Name,
        CategoryName:CategoryName,
        subCategoryName:SubCategoryName
      });
    }
    //navigation.navigate("Assign", { userStoryId: data.id,projectId:data.projectId,USName:data.name,Description:data.description,CategoryIds:CategoryId});

}

  const handleBackPress = () => {
    navigation.goBack();
  };

  const loadConnectionList = async () => {
    setLoading(true);
    setTimeout(() => {
    axios.privateAxios
      .get<UserStory[]>("/app/Task/GetProjectUSlist?ProjectId="+ projectId)
      .then((response) => {
        setLoading(false);
        setList(response.data);
        setOriginalList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
    },1000);
  };

  React.useEffect(() => {
    loadConnectionList();
  }, []);
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
        
        <Text style={styles.headingText}>User Story List</Text>
      </View>
      <View style={styles.searchbar}>
            <Ionicons name="search-outline" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} value={searchvalue}  onChangeText={(text) => searchFunction(text)}/>
          </View>
      <View style={styles.bottomView}>
      <SafeAreaView>
    <ProgressTrackerCard ></ProgressTrackerCard>
      
  </SafeAreaView>
        <Text style={styles.titleText}>Choose Your UserStory ({list.length})</Text>
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
              onPress={() => onSelect(item)}
            ></POProjectListItem>

          )}
        />


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
    top: 10,
    textAlign: 'center',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex:5,
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
    left:-8,
    top:6,
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

export default USlistScreen;
