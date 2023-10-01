import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import POButton from '../../Components/POButton';
import PODropDown from '../../Components/PODropDown';
import { useAxios } from '../../Contexts/Axios';
import { Category } from '../../Models/CategoryModel';
import { Task } from '../../Models/Task';
import { useAuth } from '../../Contexts/Auth';
import CategoryPopup from '../../Components/CategoryPopup';
import { Status } from '../../Constants/Status';
import ProgressTrackerCard from '../../Components/ProgressTrackerCard';
import LottieAnimation from '../../Components/Animation';
import FlashMessage, { showMessage } from 'react-native-flash-message';

type CategoryScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Category">;
type CategoryProp = RouteProp<EmployeeStackParamList, "UIList">;

const CategoryScreen: React.FC = () => {
  const navigation = useNavigation<CategoryScreenProp>();
  const route = useRoute<CategoryProp>();
  const axios = useAxios();
  const auth = useAuth();

  const [loading, setLoading] = React.useState(false);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState('');
  const [selectedSubCategoryValue, setSelectedSubCategoryValue] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [projectid] = React.useState(route.params?.ProjectId);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<string[]>([]);
  const [selectedSubcategoryOptions, setSelectedSubcategoryOptions] = useState<string[]>([]);
  const [applicableList, setApplicableLists] = useState<string[]>([]);
  const [Name] = React.useState<string>(route.params.Name);
  const employeeId = auth.loginData.employeeId;



  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCategorySelect = (value: string) => {
    const subCategoryOptions = subcategoryOptions.filter((item) => item.value.startsWith(value));
    setSelectedCategoryValue(value);
    setSelectedSubcategoryOptions(subCategoryOptions);
  };

  const handleSubCategorySelect = (value: string) => {

    setSelectedSubCategoryValue(value);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleSubmit = (estStartDate: Date, estTime: string, comments: string, estEndDate: Date, name: string, description: string, taskType: string, classification: string, weekEndDate: Date, TaskDescription: string) => {

    const newCreateTask: Task = {
      employeeId: employeeId,
      uIUserStoryId: undefined,
      projectId: projectid,
      categoryId: CategoryId(),
      uIId: 0,
      userStoryId: 0,
      name: name,
      estTime: parseInt(estTime),
      description: description,
      status: Status.UnAssigned,
      percentage: 0,
      actTime: 0,
      startDate: undefined,
      endDate: undefined,
      weekEndingDate: weekEndDate,
      priority: '',
      Comment: comments,
      EstimateStartDate: estStartDate,
      EstimateEndDate: estEndDate,
      taskType: taskType,
      classification: classification,
      taskDescription: TaskDescription
    }

    axios.privateAxios
      .post<string>("/app/Task/CreateTask", newCreateTask)

      .then((response) => {
        console.log(response.data)
        showMessage({
          message: 'Task Created Successfully!',
          type: 'success',
          duration: 3000,
          floating: true,
          icon: () => (
            <Ionicons name="checkmark-circle-outline" size={20} />
          ),
        });
        navigation.navigate("Home")
      })
      .catch((error) => {
        console.log(error.response.data);
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
  };


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.privateAxios.get<Category[]>("/app/Common/GetCategoriesList");
      const categorySet = new Set();
      response.data.forEach((item) => {
        categorySet.add(item.categories);
      });
      const categories = Array.from(categorySet).map((category) => ({
        label: category,
        value: category,
      }));
      const subcategories = response.data.map((item) => ({
        label: item.subCategory,
        value: `${item.categories}_${item.subCategory}`,
      }));
      const applicableList = response.data.map((item) => ({
        label: item.subCategory,
        value1: item.uiApplicable,
        value2: item.userStoryApplicable,
        value3: item.id,
      }));
      setLoading(false);
      setCategoryOptions(categories);
      setSubcategoryOptions(subcategories);
      setApplicableLists(applicableList);
      console.log(applicableList)
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const isUIApplicable = (): boolean => {
    const selectedSubcategory = selectedSubCategoryValue;
    const trimmedString = selectedSubcategory.split('_')[1];
    const applicable = applicableList.find(
      (item) => item.label === trimmedString
    );

    return applicable?.value1 || false;
  };

  const isUSApplicable = (): boolean => {
    const selectedSubcategory = selectedSubCategoryValue;
    const trimmedString = selectedSubcategory.split('_')[1];
    const applicable = applicableList.find(
      (item) => item.label === trimmedString
    );

    return applicable?.value2 || false;
  };

  const subCategory = selectedSubCategoryValue.split('_')[1];

  const CategoryId = () => {
    const selectedSubcategory = selectedSubCategoryValue;
    const trimmedString = selectedSubcategory.split('_')[1];
    const applicable = applicableList.find(
      (item) => item.label === trimmedString
    );

    const categoryId = applicable ? applicable.value3 : null;
    return categoryId;
  };

  const renderButton = () => {
    if (isUSApplicable()) {
      return (
        <POButton
          title="Continue To User Story"
          onPress={ContinueTask}
          style={styles.loginButton}
          titleStyle={styles.buttonText}
        />
      );
    } else if (selectedCategoryValue && selectedSubCategoryValue) {
      return (
        <POButton
          title="Create Task"
          onPress={CreateTask}
          style={styles.loginButton}
          titleStyle={styles.buttonText}
        />
      );
    } else {
      return (
        <POButton
          title="Create Task"
          onPress={CreateTask}
          style={[styles.loginButton]}
          titleStyle={styles.buttonText}
          disabled
        />
      );
    }
  };



  const CreateTask = () => {
    setIsPopupVisible(true);
  };

  const ContinueTask = () => {
    if (isUSApplicable()) {
      navigation.navigate("USList", { ProjectId: projectid, Name: Name, CategoryIds: CategoryId(), isUIApplicable: isUIApplicable(), CategoryName: selectedCategoryValue, subCategoryName: subCategory });
    }
  };

  return (
    <View style={styles.container}>
      <FlashMessage position="top" style ={{height:60,marginTop:40}} textStyle ={{marginTop:10,fontSize:18}}/>
      <View style={styles.topView}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={30} color="#fff" style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.welcomeMessage}>Category</Text>
      </View>
      <View style={styles.bottomView}>
        <SafeAreaView>
          <ProgressTrackerCard selectedCategory={selectedCategoryValue} selectedSubCategory={subCategory}></ProgressTrackerCard>

        </SafeAreaView>

        <Text style={styles.title}>Select Your Category</Text>
        {loading && (
          <LottieAnimation
            source={require('../../../assets/icons/Loading.json')}
            autoPlay={true}
            loop={false}
            visible={loading}
          />
        )}

        <PODropDown
          title="Category"
          placeholder="Select an option"
          data={categoryOptions}
          value={selectedCategoryValue}
          disable={false}
          setValue={setSelectedCategoryValue}
          onChange={handleCategorySelect}
        />
        <PODropDown
          title="Sub-Category"
          placeholder="Select an option"
          data={selectedSubcategoryOptions}
          value={selectedSubCategoryValue}
          disable={!selectedCategoryValue}
          setValue={setSelectedSubCategoryValue}
          onChange={handleSubCategorySelect}
        />
        <View>
          {renderButton()}
        </View>
      </View>
      <CategoryPopup
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
        onSubmit={handleSubmit}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: 20,
    marginHorizontal: 24,
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeMessage: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    bottom: 15,
  },
  bottomView: {
    flex: 6,
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
  backButton: {
    position: 'absolute',
    left: 0,
    bottom: 25,
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
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    height: 100,
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
  loginButton: {
    backgroundColor: '#35A2C1',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    top: 20,
    margin: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 20,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  animation: {
    position: 'absolute',
    width: '140%',
    height: '140%',
  },

});

export default CategoryScreen;
