
import React, { } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../../Models/Project';
import { useAxios } from '../../Contexts/Axios';
import { AdminStackParamList } from '../../Routes/AdminStack';
import LottieAnimation from '../../Components/Animation';
import { TeamEmployeeModel } from '../../Models/TeamEmployeeModel';
import { RouteProp, useRoute } from '@react-navigation/native';
import POProjectListItem from '../../Components/POProjectListItem';
import CarouselCard from '../../Components/CarouselCard';


//Navigation
type TaskListProps = NativeStackNavigationProp<AdminStackParamList, "Team">;

//Props
type TaskListRouteProps = RouteProp<AdminStackParamList, "TeamDetails">;

const TeamDetailsScreen: React.FC = () => {
  const axios = useAxios();
  const navigation = useNavigation<TaskListProps>();
  const route = useRoute<TaskListRouteProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<Project[]>([]);
  const [originalList, setOriginalList] = React.useState<TeamEmployeeModel[]>([]);
  const [selectedTeamId] = React.useState(route.params.TeamId);


  React.useEffect(() => {
    assignedProjectList();
  }, []);


  const handleBackPress = () => {
    navigation.goBack();
  };

  const assignedProjectList = async () => {
    setLoading(true);
    setTimeout(() => {
      axios.privateAxios
        .get<Project[]>("/app/Team/GetProjectList?teamId=" + selectedTeamId)
        .then((response) => {
          setLoading(false);
          setList(response.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response.data);
        });
    }, 1000);
  };

  const onSelect = async (data: Project) => {
    navigation.goBack();
  }

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

        <Text style={styles.headingText}>Team Details</Text>

      </View>
     
      <CarouselCard></CarouselCard>

      <View style={styles.bottomView}>
        {loading && (
          <LottieAnimation
            source={require('../../../assets/icons//Loading.json')}
            autoPlay={true}
            loop={false}
            visible={loading}
            style={styles.animation}
          />
        )}
       
    <View style={{ flex: 1}}>
        <Text style={styles.title}>Assigned Projects</Text>

        <FlatList
          data={list}
          renderItem={({ item }) => (
            <POProjectListItem

              Name={item.name}
              Type={item.type}
              Description={item.description}
              percentage={item.percentage}
              onPress={() => onSelect(item)}
            ></POProjectListItem>
          )}
        />
        </View>
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
    marginTop: 40,
    marginHorizontal: 24,
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  welcomeMessage: {
    position: 'absolute',
    top: 12,
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
    paddingBottom:80,
  },
  title: {
    marginHorizontal: 26,
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 20,
  },

  backButton: {
    left: -22,
    top: 1,
  },
  headingText: {
    marginRight: 50,
    textAlign: 'center',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },
  carouselContainer: {
    height: 100,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    backgroundColor: 'gray',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: -15,
    marginTop: 10,
  },
  activePaginationDot: {
    backgroundColor: 'blue',
    width: 8,
    height: 8,
    marginBottom: -15,
    marginTop: 10,
  },
});

export default TeamDetailsScreen;