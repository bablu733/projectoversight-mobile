import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../Models/Project';
import { useAxios } from '../Contexts/Axios';
import { AdminStackParamList } from '../Routes/AdminStack';
import LottieAnimation from '../Components/Animation';
import { TeamEmployeeModel } from '../Models/TeamEmployeeModel';
import { RouteProp, useRoute } from '@react-navigation/native';
import POTeamDetailsListItem from '../Components/POTeamDetailsListItem';
import POProjectListItem from '../Components/POProjectListItem';
import Swiper from 'react-native-swiper';

//Navigation
type TaskListProps = NativeStackNavigationProp<AdminStackParamList, "Team">;

//Props
type TaskListRouteProps = RouteProp<AdminStackParamList, "TeamDetails">;

const CarouselCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const axios = useAxios();
  const navigation = useNavigation<TaskListProps>();
  const route = useRoute<TaskListRouteProps>();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<TeamEmployeeModel[]>([]);
  const [originalList, setOriginalList] = React.useState<TeamEmployeeModel[]>([]);
  const [projectList, setProjectList] = React.useState<Project[]>([]);
  const [selectedTeamId] = React.useState(route.params.TeamId);

  const swiperRef = useRef<Swiper | null>(null);

  React.useEffect(() => {
    loadConnectionList();
  }, []);

  const loadConnectionList = async () => {
    setLoading(true);
    axios.privateAxios
      .get<TeamEmployeeModel[]>("/app/Team/GetTeamEmployeelist?teamId=" + selectedTeamId)
      .then((response) => {
        setLoading(false);
        setList(response.data);
        setOriginalList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
      });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const goToNextSlide = () => {
    if (swiperRef.current) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      swiperRef.current.scrollTo(nextIndex, true);
    }
  };

  const goToPreviousSlide = () => {
    if (swiperRef.current) {
      const previousIndex = activeIndex - 1;
      setActiveIndex(previousIndex);
      swiperRef.current.scrollBy(previousIndex, true);
    }
  };

  const onIndexChanged = (index: number) => {
    setActiveIndex(index);
  };

  return (
    
    <View style={styles.carouselContainer}>
     <TouchableOpacity
  style={[styles.button1, styles.buttonPrevious]}
  onPress={goToPreviousSlide}
  disabled={activeIndex === 0}
>
  <Ionicons name="chevron-back" size={30} color="white"/>
</TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        showsButtons={false}
        autoplay={false}
        dotStyle={styles.paginationDot}
        activeDotStyle={styles.activePaginationDot}
        onIndexChanged={onIndexChanged}
      >
        {list.map((item, index) => (
          <View style={styles.carouselItem} key={index}>
            <POTeamDetailsListItem Name={item.employeeName} />
          </View>
        ))}
      </Swiper>

    
        <TouchableOpacity
          style={styles.button}
          onPress={goToNextSlide}
          disabled={activeIndex === list.length - 1}
        >
          <Ionicons name="chevron-forward" size={30} color="white" />
        </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paginationDot: {
    backgroundColor: 'gray',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activePaginationDot: {
    backgroundColor: 'blue',
    width: 8,
    height: 8,
    borderRadius: 6,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:20 ,
  },
  button1: {
    position: 'absolute',
    top: '50%',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrevious: {
    left: 10,
  },
  button: {
    position:'absolute',
    left:346,
    top:45,
  },
});

export default CarouselCard;
